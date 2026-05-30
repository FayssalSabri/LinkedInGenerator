import { describe, it, expect } from 'vitest';
import { getCachedResponse, setCachedResponse } from '../lib/cache';

describe('Cache — Réponses en mémoire', () => {
  const mockResponse = {
    publication: '🚀 Post LinkedIn de test.',
    note: "Note d'intention pour le test.",
  };

  it('retourne null pour une clé inexistante', async () => {
    expect(await getCachedResponse('inexistant-' + Date.now())).toBeNull();
  });

  it('stocke et récupère une réponse', async () => {
    const key = 'test-key-' + Date.now();
    await setCachedResponse(key, mockResponse);
    const result = await getCachedResponse(key);
    expect(result).toEqual(mockResponse);
  });

  it('retourne la structure complète avec publication et note', async () => {
    const key = 'test-structure-' + Date.now();
    await setCachedResponse(key, mockResponse);
    const result = await getCachedResponse(key);
    expect(result).toHaveProperty('publication');
    expect(result).toHaveProperty('note');
    expect(result?.publication).toBe(mockResponse.publication);
    expect(result?.note).toBe(mockResponse.note);
  });
});
