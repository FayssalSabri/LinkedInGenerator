/**
 * Safe localStorage wrapper with SSR guard and error handling.
 * Prevents crashes from corrupted data or server-side rendering.
 */

export interface HistoryItem {
  id: string;
  timestamp: number;
  params: {
    mode?: string;
    description?: string;
    brief?: string;
    tone?: string;
    draft?: string;
  };
  publication: string;
  note: string;
}

const STORAGE_KEY = 'linkedin_history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Retrieves generation history from localStorage safely.
 * Returns empty array on SSR, corrupted data, or any error.
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.warn('[storage] Impossible de lire l\'historique — données corrompues ?');
    return [];
  }
}

/**
 * Saves a new generation to history, prepending it and capping at MAX_HISTORY_ITEMS.
 */
export function saveToHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...item,
  };

  const current = getHistory();
  const updated = [newItem, ...current].slice(0, MAX_HISTORY_ITEMS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.warn('[storage] Impossible de sauvegarder dans localStorage');
  }

  return newItem;
}

/**
 * Clears all generation history from localStorage.
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn('[storage] Impossible de supprimer l\'historique');
  }
}
