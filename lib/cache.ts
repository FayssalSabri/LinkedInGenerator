import { createHash } from 'crypto';
import { Redis } from '@upstash/redis';
import { type GenerationResponse } from './schemas';

interface CacheEntry {
  data: GenerationResponse;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const TTL_SECONDS = 60 * 60;

let redisClient: Redis | null = null;

function getRedis(): Redis | null {
  if (redisClient) return redisClient;
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  redisClient = Redis.fromEnv();
  return redisClient;
}

function cacheKeyHash(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Retrieves a cached AI generation response if it exists and hasn't expired.
 */
export async function getCachedResponse(
  key: string
): Promise<GenerationResponse | null> {
  const redis = getRedis();
  if (redis) {
    const stored = await redis.get<string>(`forge:cache:${cacheKeyHash(key)}`);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as GenerationResponse;
    } catch {
      return null;
    }
  }

  const entry = memoryCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL_SECONDS * 1000) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Stores an AI generation response in cache (Redis or in-memory).
 */
export async function setCachedResponse(
  key: string,
  data: GenerationResponse
): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(`forge:cache:${cacheKeyHash(key)}`, JSON.stringify(data), {
      ex: TTL_SECONDS,
    });
    return;
  }

  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}
