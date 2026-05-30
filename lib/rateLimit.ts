/**
 * Rate limiting per user (or IP fallback).
 * Uses Upstash Redis in production when configured; in-memory fallback for local dev and CI.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

const requests = new Map<string, number[]>();

let upstashRatelimit: Ratelimit | null = null;

function getUpstashRatelimit(): Ratelimit | null {
  if (upstashRatelimit) return upstashRatelimit;
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  const redis = Redis.fromEnv();
  upstashRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '1 m'),
    prefix: 'forge:ratelimit',
  });
  return upstashRatelimit;
}

function isRateLimitedMemory(key: string): boolean {
  const now = Date.now();
  const timestamps =
    requests.get(key)?.filter((t) => now - t < WINDOW_MS) ?? [];

  if (timestamps.length >= MAX_REQUESTS) {
    requests.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requests.set(key, timestamps);
  return false;
}

function getRemainingRequestsMemory(key: string): number {
  const now = Date.now();
  const timestamps =
    requests.get(key)?.filter((t) => now - t < WINDOW_MS) ?? [];
  return Math.max(0, MAX_REQUESTS - timestamps.length);
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
}

/**
 * Checks rate limit and returns whether the client is blocked plus remaining quota.
 * Prefer passing Clerk `userId`; falls back to IP when anonymous (should not occur on /api/generate).
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  const ratelimit = getUpstashRatelimit();
  if (ratelimit) {
    const { success, remaining } = await ratelimit.limit(key);
    return { limited: !success, remaining };
  }

  const limited = isRateLimitedMemory(key);
  return { limited, remaining: getRemainingRequestsMemory(key) };
}

/** @deprecated Use checkRateLimit — kept for tests that assert sync memory behavior. */
export function isRateLimited(key: string): boolean {
  return isRateLimitedMemory(key);
}

/** @deprecated Use checkRateLimit — kept for tests. */
export function getRemainingRequests(key: string): number {
  return getRemainingRequestsMemory(key);
}
