import { buildSystemPrompt, buildUserPrompt } from './prompt';
import type { GenerationParams } from './schemas';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export interface GroqCompletionResult {
  publication: string;
  note: string;
}

function buildMessages(params: GenerationParams) {
  return [
    {
      role: 'system' as const,
      content: `${ANTI_TOOL_PREFIX}\n\n${buildSystemPrompt(params.mode)}`,
    },
    { role: 'user' as const, content: buildUserPrompt(params) },
  ];
}

/** Stops Llama on Groq from emitting XML/function syntax that triggers 400 tool_use_failed. */
const ANTI_TOOL_PREFIX =
  'IMPORTANT: Tu ne dois utiliser aucun outil, aucune fonction, aucune balise XML (<function>, etc.). ' +
  'Réponds uniquement avec un objet JSON brut contenant exactement les clés "publication" et "note".';

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error('Réponse IA non-JSON');
  }
}

async function requestGroq(
  apiKey: string,
  params: GenerationParams,
  useJsonMode: boolean
): Promise<Response> {
  const body: Record<string, unknown> = {
    model: MODEL,
    messages: buildMessages(params),
    temperature: 0.7,
    max_tokens: 2048,
  };

  if (useJsonMode) {
    body.response_format = { type: 'json_object' };
  }

  return fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

async function parseGroqResponse(response: Response): Promise<string> {
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Réponse IA vide');
  }
  return content;
}

export async function logGroqError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const message = data?.error?.message ?? JSON.stringify(data);
    const code = data?.error?.code ?? '';
    console.error(`[API] Erreur Groq ${response.status}:`, message, code || '');
    return message;
  } catch {
    const text = await response.text();
    console.error(`[API] Erreur Groq ${response.status}:`, text);
    return text;
  }
}

/**
 * Calls Groq chat completions with JSON mode; retries once without json_object on 400.
 */
export async function completeGeneration(
  apiKey: string,
  params: GenerationParams
): Promise<string> {
  let response = await requestGroq(apiKey, params, true);

  if (response.status === 400) {
    await logGroqError(response.clone());
    response = await requestGroq(apiKey, params, false);
  }

  if (!response.ok) {
    await logGroqError(response);
    throw new GroqApiError(response.status);
  }

  return parseGroqResponse(response);
}

export class GroqApiError extends Error {
  constructor(public readonly status: number) {
    super(`Groq API error: ${status}`);
    this.name = 'GroqApiError';
  }
}
