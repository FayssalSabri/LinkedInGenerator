import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getHistory, saveToHistory, clearHistory } from '../lib/storage';

// Mock localStorage for Node.js environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: { randomUUID: () => `test-${Date.now()}-${Math.random().toString(36).slice(2)}` },
});

describe('Storage — Historique local sécurisé', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('retourne un tableau vide quand aucun historique n\'existe', () => {
    expect(getHistory()).toEqual([]);
  });

  it('sauvegarde et récupère un élément', () => {
    const item = saveToHistory({
      params: { description: 'Test', brief: 'Brief', tone: 'Expert' },
      publication: 'Post test',
      note: 'Note test',
    });

    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].publication).toBe('Post test');
    expect(history[0].id).toBeTruthy();
    expect(history[0].timestamp).toBeGreaterThan(0);
  });

  it('prépend les nouveaux éléments (le plus récent en premier)', () => {
    saveToHistory({
      params: { description: 'Test 1', brief: 'Premier', tone: 'Pro' },
      publication: 'Post 1',
      note: 'Note 1',
    });
    saveToHistory({
      params: { description: 'Test 2', brief: 'Second', tone: 'Expert' },
      publication: 'Post 2',
      note: 'Note 2',
    });

    const history = getHistory();
    expect(history[0].publication).toBe('Post 2');
    expect(history[1].publication).toBe('Post 1');
  });

  it('limite l\'historique à 10 éléments', () => {
    for (let i = 0; i < 15; i++) {
      saveToHistory({
        params: { description: `Desc ${i}`, brief: `Brief ${i}`, tone: 'Expert' },
        publication: `Post ${i}`,
        note: `Note ${i}`,
      });
    }

    const history = getHistory();
    expect(history.length).toBeLessThanOrEqual(10);
  });

  it('efface l\'historique correctement', () => {
    saveToHistory({
      params: { description: 'Test', brief: 'Brief', tone: 'Expert' },
      publication: 'Post',
      note: 'Note',
    });

    clearHistory();
    expect(getHistory()).toEqual([]);
  });

  it('gère les données corrompues sans crash', () => {
    localStorageMock.getItem.mockReturnValueOnce('{ invalid json !!!');
    expect(() => getHistory()).not.toThrow();
    expect(getHistory()).toEqual([]);
  });
});
