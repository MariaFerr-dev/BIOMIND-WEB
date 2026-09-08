import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, resolve, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

createServer((request, response) => {
  let requested;
  try { requested = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Solicitud inválida'); return; }
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
