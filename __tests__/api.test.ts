import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../app/api/generate/route';

// Mocks
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

vi.mock('../lib/rateLimit', () => ({
  isRateLimited: vi.fn(),
  getRemainingRequests: vi.fn(() => 9),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => new Map([['x-forwarded-for', '127.0.0.1']])),
}));

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GROQ_API_KEY = 'test-key';
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
      body: JSON.stringify({ description: 'A', brief: 'test', tone: 'Expert' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('retourne 500 si la clé API Groq est absente', async () => {
    delete process.env.GROQ_API_KEY;
    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert'
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it('retourne 429 si la limite de requêtes est atteinte', async () => {
    const rateLimit = await import('../lib/rateLimit');
    vi.mocked(rateLimit.isRateLimited).mockReturnValueOnce(true);

    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert'
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('60');
  });

  it('appelle l\'API Groq et retourne la réponse valide', async () => {
    const rateLimit = await import('../lib/rateLimit');
    vi.mocked(rateLimit.isRateLimited).mockReturnValueOnce(false);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: JSON.stringify({
              publication: '🚀 Post valide.',
              note: 'Note valide.'
            })
          }
        }]
      })
    });

    const req = new Request('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        description: 'Une entreprise valide.',
        brief: 'Test brief.',
        tone: 'Expert'
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data.publication).toBe('🚀 Post valide.');
    expect(data.note).toBe('Note valide.');
  });
});
