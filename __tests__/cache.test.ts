import { describe, it, expect, beforeEach } from 'vitest';
import { getCachedResponse, setCachedResponse } from '../lib/cache';

describe('Cache — Réponses en mémoire', () => {
  const mockResponse = {
    publication: '🚀 Post LinkedIn de test.',
    note: 'Note d\'intention pour le test.'
  };

  it('retourne null pour une clé inexistante', () => {
    expect(getCachedResponse('inexistant')).toBeNull();
  });

  it('stocke et récupère une réponse', () => {
    const key = 'test-key-' + Date.now();
    setCachedResponse(key, mockResponse);
    const result = getCachedResponse(key);
    expect(result).toEqual(mockResponse);
  });

  it('retourne la structure complète avec publication et note', () => {
    const key = 'test-structure-' + Date.now();
    setCachedResponse(key, mockResponse);
    const result = getCachedResponse(key);
    expect(result).toHaveProperty('publication');
    expect(result).toHaveProperty('note');
    expect(result?.publication).toBe(mockResponse.publication);
    expect(result?.note).toBe(mockResponse.note);
  });
});
