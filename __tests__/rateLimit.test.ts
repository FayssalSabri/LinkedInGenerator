import { describe, it, expect, beforeEach } from 'vitest';
import { isRateLimited, getRemainingRequests } from '../lib/rateLimit';

describe('Rate Limiter', () => {
  // Use unique IPs per test to avoid state leaking
  const uniqueIp = () => `test-${Date.now()}-${Math.random()}`;

  it('autorise la première requête', () => {
    const ip = uniqueIp();
    expect(isRateLimited(ip)).toBe(false);
  });

  it('autorise les requêtes sous la limite', () => {
    const ip = uniqueIp();
    for (let i = 0; i < 9; i++) {
      expect(isRateLimited(ip)).toBe(false);
    }
  });

  it('bloque au-delà de la limite', () => {
    const ip = uniqueIp();
    // Consume all 10 allowed requests
    for (let i = 0; i < 10; i++) {
      isRateLimited(ip);
    }
    // 11th should be blocked
    expect(isRateLimited(ip)).toBe(true);
  });

  it('retourne le nombre de requêtes restantes', () => {
    const ip = uniqueIp();
    expect(getRemainingRequests(ip)).toBe(10);
    isRateLimited(ip);
    expect(getRemainingRequests(ip)).toBe(9);
  });

  it('isole les limites par adresse IP', () => {
    const ip1 = uniqueIp();
    const ip2 = uniqueIp();
    for (let i = 0; i < 10; i++) {
      isRateLimited(ip1);
    }
    expect(isRateLimited(ip1)).toBe(true);
    expect(isRateLimited(ip2)).toBe(false);
  });
});
