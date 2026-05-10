import { type GenerationResponse } from './schemas';

interface CacheEntry {
  data: GenerationResponse;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const TTL = 1000 * 60 * 60; // 1 heure

/**
 * Retrieves a cached AI generation response if it exists and hasn't expired.
 * @param key - Cache key derived from generation parameters
 * @returns The cached response or null if expired/missing
 */
export function getCachedResponse(key: string): GenerationResponse | null {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Stores an AI generation response in the in-memory cache.
 * @param key - Cache key derived from generation parameters
 * @param data - The validated generation response to cache
 */
export function setCachedResponse(key: string, data: GenerationResponse): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}
