import { NextResponse } from 'next/server';
import { getCachedResponse, setCachedResponse } from '@/lib/cache';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt';
import { generationSchema, responseSchema } from '@/lib/schemas';
import { isRateLimited, getRemainingRequests } from '@/lib/rateLimit';
import { headers } from 'next/headers';

/**
 * POST /api/generate
 * Generates a LinkedIn publication via the Groq API (Llama-3.3-70b).
 * Includes: input validation, rate limiting, caching, and output validation.
 */
export async function POST(req: Request) {
  try {
    // ── Rate Limiting ────────────────────────────────────────
    const headersList = await headers();
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter une minute.' },
        {
          status: 429,
          headers: { 'Retry-After': '60' },
        }
      );
    }

    // ── API Key Check ────────────────────────────────────────
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[API] GROQ_API_KEY non configurée');
      return NextResponse.json(
        { error: 'Erreur de configuration serveur.' },
        { status: 500 }
      );
    }

    // ── Input Validation ─────────────────────────────────────
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
    }

    const validation = generationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // ── Cache Check ──────────────────────────────────────────
    const { description, brief, tone } = validation.data;
    const cacheKey = JSON.stringify({ description, brief, tone });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return NextResponse.json({ ...cachedResponse, _cached: true });
    }

    // ── Groq API Call ────────────────────────────────────────
    const start = Date.now();
    console.log(`[API] Génération lancée — Ton: ${tone}`);

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt({ description, brief, tone }) }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!groqResponse.ok) {
      console.error(`[API] Erreur Groq: ${groqResponse.status}`);
      return NextResponse.json(
        { error: "L'IA est temporairement indisponible. Veuillez réessayer." },
        { status: 503 }
      );
    }

    // ── Response Parsing & Validation ────────────────────────
    const data = await groqResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('Réponse IA vide');
    }

    const parsedContent = JSON.parse(content);
    const resultValidation = responseSchema.safeParse(parsedContent);

    if (!resultValidation.success) {
      console.error('[API] Erreur de validation:', resultValidation.error.issues);
      return NextResponse.json(
        { error: 'Format de réponse IA invalide.' },
        { status: 500 }
      );
    }

    // ── Cache & Return ───────────────────────────────────────
    setCachedResponse(cacheKey, resultValidation.data);
    const duration = Date.now() - start;
    console.log(`[API] Succès — Durée: ${duration}ms`);

    return NextResponse.json(resultValidation.data, {
      headers: {
        'X-Response-Time': `${duration}ms`,
        'X-Rate-Limit-Remaining': String(getRemainingRequests(clientIp)),
      },
    });

  } catch (error) {
    console.error('[API] Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
