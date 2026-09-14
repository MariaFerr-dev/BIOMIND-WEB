import type { WorkspaceChatMessage } from '@/features/workspace/types';

type GeminiReplyParams = {
  history: WorkspaceChatMessage[];
  systemInstruction: string;
};

type GeminiErrorCode =
  | 'gemini/missing-api-key'
  | 'gemini/request-failed'
  | 'gemini/empty-response'
  | 'gemini/model-overloaded';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const DEFAULT_GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

function createGeminiError(code: GeminiErrorCode, message: string, status?: number) {
  const error = new Error(message) as Error & { code: GeminiErrorCode; status?: number };
  error.code = code;
  error.status = status;
  return error;
}

function parseModelList(value?: string) {
  return String(value || '')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);
}

function uniqueModels(models: string[]) {
  return Array.from(new Set(models.filter(Boolean)));
}

const GEMINI_MODELS = uniqueModels([
  ...parseModelList(process.env.EXPO_PUBLIC_GEMINI_MODEL),
  ...parseModelList(process.env.EXPO_PUBLIC_GEMINI_FALLBACK_MODELS),
  ...DEFAULT_GEMINI_MODELS,
]);

function normalizeGeminiHistory(history: WorkspaceChatMessage[]) {
  return history.map((message) => ({
    role: message.role,
    parts: [{ text: message.text }],
  }));
}

function extractResponseText(payload: any) {
  const parts = payload?.candidates?.[0]?.content?.parts;

  if (!Array.isArray(parts)) {
    return '';
  }

  return parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim();
}

function shouldTryNextModel(status = 0, message = '') {
  return [404, 429, 500, 502, 503, 504].includes(status)
    || /high demand|overloaded|try again later|temporarily unavailable|rate limit|quota|not found|not supported|does not exist|not available/i.test(message);
}

function mapRequestFailureMessage(status: number, message: string) {
  if (shouldTryNextModel(status, message)) {
    return 'Gemini esta con alta demanda en este momento. Intenta de nuevo en unos segundos.';
  }

  return message || 'No pudimos comunicarnos con Gemini en este momento.';
}

async function requestLocalGeminiServer({
  history,
  systemInstruction,
}: GeminiReplyParams) {
  if (typeof window === 'undefined') {
    return '';
  }

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, systemInstruction }),
  }).catch(() => null);

  if (!response || response.status === 404) {
    return '';
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const code = payload?.code || (response.status === 503 ? 'gemini/model-overloaded' : 'gemini/request-failed');
    throw createGeminiError(code, payload?.error || 'No pudimos comunicarnos con Gemini.', response.status);
  }

  return typeof payload?.text === 'string' ? payload.text.trim() : '';
}

function getLastUserMessage(history: WorkspaceChatMessage[]) {
  return [...history].reverse().find((message) => message.role === 'user' && message.text.trim())?.text.trim() || '';
}

function compactTitle(text: string) {
  const words = text
    .replace(/[¿?¡!.,;:()[\]{}"']/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, 5);

  return words.length ? words.join(' ') : 'Conversacion local';
}

function buildLocalTechnicalAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (/hipoclorito|cloro|lavandina|sodio/.test(normalized) && /enjuag|lavar|lavado/.test(normalized)) {
    return [
      'Es importante realizar varios enjuagues despues de usar hipoclorito de sodio porque el hipoclorito es un desinfectante fuerte y puede quedar como residuo sobre el material vegetal, los recipientes o la superficie tratada.',
      '',
      'Si no se retira bien, esos residuos pueden causar fitotoxicidad, danar tejidos, alterar el pH del medio, inhibir el crecimiento o afectar la viabilidad del cultivo. En practica de laboratorio, los enjuagues con agua esteril ayudan a conservar el efecto de desinfeccion inicial sin dejar concentraciones que perjudiquen la muestra.',
      '',
      'Recomendacion practica: registra concentracion, tiempo de exposicion y numero de enjuagues para que el procedimiento sea repetible y puedas comparar resultados entre muestras.',
    ].join('\n');
  }

  if (/informe|reporte/.test(normalized)) {
    return [
      'Puedo ayudarte a estructurarlo localmente con este esquema:',
      '',
      '1. Objetivo de la practica o ficha.',
      '2. Datos observados y evidencias disponibles.',
      '3. Hallazgos principales.',
      '4. Riesgos o aspectos por corregir.',
      '5. Recomendaciones y siguiente accion.',
      '',
      `Borrador base: ${question}`,
    ].join('\n');
  }

  if (/resumen|resume|resumir/.test(normalized)) {
    return [
      'Resumen local:',
      '',
      `La solicitud se centra en: ${question}`,
      '',
      'Puntos a revisar: objetivo, datos registrados, evidencias, novedades y acciones pendientes.',
    ].join('\n');
  }

  if (/retroalimentacion|retroalimentación|feedback/.test(normalized)) {
    return [
      'Retroalimentacion sugerida:',
      '',
      'Buen avance en el registro. Para fortalecer la entrega, verifica que la observacion incluya fecha, procedimiento, condiciones del cultivo, evidencia y una conclusion breve. Si hubo una desviacion, explica la causa probable y la accion correctiva.',
    ].join('\n');
  }

  if (/off[-\s]?target|fuera de diana|grna|arn guia|arn guía|crispr|cas9|poliploide|trigo|papa/.test(normalized)) {
    return [
      'Para minimizar efectos fuera de diana al diseñar ARN guia en cultivos poliploides, conviene combinar control bioinformatico, validacion experimental y una estrategia de edicion conservadora.',
      '',
      '1. Diseña gRNA en regiones conservadas solo si quieres editar varias copias homologas; si buscas especificidad, elige secuencias que distingan homeologos o alelos.',
      '2. Revisa el genoma o pangenoma disponible y descarta guias con similitud alta en otros loci, especialmente en la semilla proximal PAM y en los 10-12 nucleotidos cercanos al PAM.',
      '3. Prioriza guias con pocas coincidencias parciales, buen contenido GC y sin repeticiones largas.',
      '4. Usa variantes de Cas de alta fidelidad o nickasas cuando el sistema lo permita.',
      '5. Valida por PCR/secuenciacion los sitios candidatos off-target y compara plantas editadas con controles no editados.',
      '',
      'En trigo o papa, el punto critico es que la poliploidia aumenta secuencias parecidas: una guia puede cortar copias homeologas no deseadas. Por eso no basta con revisar un solo gen; hay que revisar familias homologas y regiones repetitivas antes de transformar.',
    ].join('\n');
  }

  if (/pregunta|duda|tecnica|t[eé]cnica|biotecnolog|cultivo|laboratorio|explante|medio|contaminaci[oó]n|esteriliz|pcr|secuenciaci[oó]n|gen|genoma/.test(normalized)) {
    return [
      'Respuesta tecnica local:',
      '',
      `Sobre tu consulta: ${question}`,
      '',
      'Te sugiero analizarla con esta ruta:',
      '1. Define el objetivo del procedimiento y la variable que quieres controlar.',
      '2. Identifica posibles fuentes de error: contaminacion, concentracion, tiempo de exposicion, pH, temperatura, material vegetal o calidad del registro.',
      '3. Compara contra un control o una muestra testigo.',
      '4. Registra evidencias observables y, si aplica, confirma con una prueba complementaria.',
      '',
      'Si me das el protocolo, concentraciones o resultados observados, puedo ayudarte a convertirlo en una respuesta mas especifica.',
    ].join('\n');
  }

  return [
    'Respuesta local de BIOMIND IA:',
    '',
    `Entiendo tu consulta: "${question || 'sin texto'}".`,
    '',
    'Puedo ayudarte localmente con explicaciones, estructura de informes, listas de revision y borradores. Dame un poco mas de contexto del laboratorio o de la ficha y lo aterrizo mejor.',
  ].join('\n');
}

function generateLocalReply({ history, systemInstruction }: GeminiReplyParams) {
  const lastUserMessage = getLastUserMessage(history);

  if (/crea\s+un\s+t[ií]tulo|t[ií]tulo\s+de\s+m[aá]ximo\s+(?:cinco|5)\s+palabras|devuelve\s+(?:unicamente|únicamente)\s+el\s+t[ií]tulo/i.test(systemInstruction)) {
    return compactTitle(lastUserMessage);
  }

  if (/pregunta de seguimiento|siguiente pregunta|una sola pregunta/i.test(systemInstruction)) {
    return '¿Que evidencia o dato del procedimiento puedes agregar para completar el registro?';
  }

  return buildLocalTechnicalAnswer(lastUserMessage);
}

async function requestGeminiModel({
  history,
  model,
  systemInstruction,
}: GeminiReplyParams & { model: string }) {
  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY || '',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: normalizeGeminiHistory(history),
        generationConfig: {
          temperature: 0.35,
          topP: 0.85,
          maxOutputTokens: 700,
        },
        }),
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Fallo temporal de conexión con Gemini.';
    throw createGeminiError('gemini/model-overloaded', message);
  }

  const payload = await response.json().catch(() => null);
  const message =
    payload?.error?.message ||
    'No pudimos comunicarnos con Gemini en este momento.';

  if (!response.ok) {
    throw createGeminiError(
      shouldTryNextModel(response.status, message) ? 'gemini/model-overloaded' : 'gemini/request-failed',
      mapRequestFailureMessage(response.status, message),
      response.status
    );
  }

  const text = extractResponseText(payload);

  if (!text) {
    throw createGeminiError(
      'gemini/empty-response',
      'Gemini no devolvio texto util para esta consulta.'
    );
  }

  return text;
}

export async function generateGeminiReply({
  history,
  systemInstruction,
}: GeminiReplyParams): Promise<string> {
  try {
    const serverReply = await requestLocalGeminiServer({ history, systemInstruction });
    if (serverReply) {
      return serverReply;
    }
  } catch (error) {
    const typedError = error as Error & { code?: GeminiErrorCode };
    if (typedError.code !== 'gemini/missing-api-key') {
      throw typedError;
    }
  }

  if (!GEMINI_API_KEY) {
    return generateLocalReply({ history, systemInstruction });
  }

  let lastError: (Error & { code?: GeminiErrorCode; status?: number }) | null = null;

  for (const model of GEMINI_MODELS) {
    try {
      return await requestGeminiModel({ history, model, systemInstruction });
    } catch (error) {
      const typedError = error as Error & { code?: GeminiErrorCode; status?: number };
      lastError = typedError;

      if (typedError.code !== 'gemini/model-overloaded') {
        throw typedError;
      }
    }
  }

  throw lastError || createGeminiError(
    'gemini/model-overloaded',
    'Gemini esta con alta demanda en este momento. Intenta de nuevo en unos segundos.'
  );
}
