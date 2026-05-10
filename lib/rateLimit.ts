/**
 * Simple in-memory rate limiter for API routes.
 * Limits requests per IP address within a sliding time window.
 */

const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // 10 requests per minute

/**
 * Checks if an IP address has exceeded the rate limit.
 * @param ip - Client IP address
 * @returns true if the client should be rate limited
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requests.get(ip)?.filter(t => now - t < WINDOW_MS) ?? [];

  if (timestamps.length >= MAX_REQUESTS) {
    requests.set(ip, timestamps);
    return true;
  }

  timestamps.push(now);
  requests.set(ip, timestamps);
  return false;
}

/**
 * Returns the number of remaining requests for an IP within the current window.
 */
export function getRemainingRequests(ip: string): number {
  const now = Date.now();
  const timestamps = requests.get(ip)?.filter(t => now - t < WINDOW_MS) ?? [];
  return Math.max(0, MAX_REQUESTS - timestamps.length);
}
