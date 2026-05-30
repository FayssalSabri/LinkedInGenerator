import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractJsonObject, completeGeneration } from '../lib/groq';

describe('extractJsonObject', () => {
  it('parse du JSON brut', () => {
    expect(extractJsonObject('{"publication":"a","note":"b"}')).toEqual({
      publication: 'a',
      note: 'b',
    });
  });

  it('extrait le JSON entouré de texte', () => {
    expect(
      extractJsonObject('Voici le résultat:\n{"publication":"a","note":"b"}\n')
    ).toEqual({ publication: 'a', note: 'b' });
  });
});

describe('completeGeneration', () => {
  const mockFetch = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = mockFetch;
  });

  it('réessaie sans json_object après une erreur 400', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        clone: () => ({
          json: async () => ({
            error: { message: 'tool_use_failed', code: 'tool_use_failed' },
          }),
        }),
        json: async () => ({
          error: { message: 'tool_use_failed', code: 'tool_use_failed' },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  publication: 'OK',
                  note: 'Note',
                }),
              },
            },
          ],
        }),
      });

    const content = await completeGeneration('test-key', {
      mode: 'generate',
      description: 'Une entreprise valide pour test.',
      brief: 'Brief de test valide.',
      tone: 'Expert',
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    const secondBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    expect(secondBody.response_format).toBeUndefined();
    expect(content).toContain('OK');
  });
});
