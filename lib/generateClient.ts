import { type GenerationParams, type GenerationResponse } from './schemas';

/**
 * Calls the authenticated generate API from the client.
 */
export async function requestGeneration(
  params: GenerationParams,
  signal?: AbortSignal
): Promise<GenerationResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue.');
  }

  return data as GenerationResponse;
}
