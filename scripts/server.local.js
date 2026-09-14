import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, resolve, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const defaultGeminiModels = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

function loadEnvFile() {
  const envPath = resolve(root, '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        rejectBody(new Error('Solicitud demasiado grande.'));
      }
    });
    request.on('end', () => {
      try { resolveBody(body ? JSON.parse(body) : {}); }
      catch { rejectBody(new Error('JSON inválido.')); }
    });
    request.on('error', rejectBody);
  });
}

function parseModelList(value) {
  return String(value || '').split(',').map((model) => model.trim()).filter(Boolean);
}

function extractGeminiText(payload) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  return Array.isArray(parts)
    ? parts.map((part) => typeof part?.text === 'string' ? part.text : '').join('\n').trim()
    : '';
}

function shouldTryNextModel(status = 0, message = '') {
  return [404, 429, 500, 502, 503, 504].includes(status)
    || /high demand|overloaded|try again later|temporarily unavailable|rate limit|quota|not found|not supported|does not exist|not available/i.test(message);
}

async function handleGeminiRequest(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Método no permitido.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    sendJson(response, 503, {
      code: 'gemini/missing-api-key',
      error: 'Configura GEMINI_API_KEY en .env y reinicia el servidor local.',
    });
    return;
  }

  let payload;
  try { payload = await readJsonBody(request); }
  catch (error) {
    sendJson(response, 400, { error: error.message || 'Solicitud inválida.' });
    return;
  }

  const models = Array.from(new Set([
    ...parseModelList(process.env.GEMINI_MODEL),
    ...parseModelList(process.env.GEMINI_FALLBACK_MODELS),
    ...defaultGeminiModels,
  ]));
  const contents = Array.isArray(payload.history)
    ? payload.history.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(message.text || '') }],
    }))
    : [];
  let lastError = 'No pudimos comunicarnos con Gemini.';

  for (const model of models) {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: String(payload.systemInstruction || '') }] },
          contents,
          generationConfig: { temperature: 0.35, topP: 0.85, maxOutputTokens: 900 },
        }),
      }
    ).catch((error) => ({ ok: false, status: 503, json: async () => ({ error: { message: error.message } }) }));
    const geminiPayload = await geminiResponse.json().catch(() => null);
    const message = geminiPayload?.error?.message || lastError;

    if (!geminiResponse.ok) {
      lastError = message;
      if (shouldTryNextModel(geminiResponse.status, message)) continue;
      sendJson(response, geminiResponse.status || 502, { code: 'gemini/request-failed', error: message });
      return;
    }

    const text = extractGeminiText(geminiPayload);
    if (text) {
      sendJson(response, 200, { text, model });
      return;
    }

    lastError = 'Gemini no devolvió texto útil.';
  }

  sendJson(response, 503, { code: 'gemini/model-overloaded', error: lastError });
}

loadEnvFile();

createServer(async (request, response) => {
  let requested;
  try { requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Solicitud inválida'); return; }
  if (requested === '/api/gemini') {
    await handleGeminiRequest(request, response);
    return;
  }
  if (!['/', '/index.html', '/styles.css', '/landing.js'].includes(requested) && !requested.startsWith('/app/') && !requested.startsWith('/assets/')) {
    if (requested === '/app') { response.writeHead(302, { Location: '/app/' }).end(); return; }
    response.writeHead(404).end('No encontrado'); return;
  }
  let file = resolve(root, '.' + requested);
  const within = relative(root, file);
  if (within.startsWith('..') || isAbsolute(within) || requested.split('/').some(p => p.startsWith('.'))) {
    response.writeHead(403).end('Acceso denegado'); return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && !extname(file) && existsSync(file + '.html')) file += '.html';
  if (!existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404).end('No encontrado'); return;
  }
  response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  if (request.method === 'HEAD') { response.end(); return; }
  createReadStream(file).on('error', () => response.destroy()).pipe(response);
}).listen(port, '127.0.0.1', () => console.log(`BioMind web listo en http://127.0.0.1:${port}`));
