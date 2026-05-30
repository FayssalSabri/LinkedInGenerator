import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/generate/route';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(async () => ({ userId: 'test-user' })),
}));

vi.mock('../lib/rateLimit', () => ({
  checkRateLimit: vi.fn(async () => ({ limited: false, remaining: 9 })),
}));

vi.mock('../lib/cache', () => ({
  getCachedResponse: vi.fn(async () => null),
  setCachedResponse: vi.fn(async () => undefined),
}));

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
  });

  it("retourne 401 si l'utilisateur n'est pas authentifié", async () => {
    const { auth } = await import('@clerk/nextjs/server');
    vi.mocked(auth).mockResolvedValueOnce({ userId: null } as never);

    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mode: 'generate',
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('retourne 400 si le body est vide ou invalide', async () => {
    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('retourne 400 si la description est trop courte', async () => {
    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mode: 'generate',
        description: 'Court',
        brief: 'Brief valide.',
        tone: 'Expert',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('retourne 500 si la clé API Groq est absente', async () => {
    delete process.env.GROQ_API_KEY;
    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mode: 'generate',
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('retourne 429 si la limite de requêtes est atteinte', async () => {
    const rateLimit = await import('../lib/rateLimit');
    vi.mocked(rateLimit.checkRateLimit).mockResolvedValueOnce({
      limited: true,
      remaining: 0,
    });

    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mode: 'generate',
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('60');
  });

  it("appelle l'API Groq et retourne la réponse valide", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                publication: '🚀 Post valide.',
                note: 'Note valide.',
              }),
            },
          },
        ],
      }),
    });

    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        mode: 'generate',
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.publication).toBe('🚀 Post valide.');
    expect(data.note).toBe('Note valide.');
  });
});
