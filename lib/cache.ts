interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 1000 * 60 * 60; // 1 heure

export function getCachedResponse(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCachedResponse(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}
