import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCachedResponse, setCachedResponse } from '@/lib/cache';
import { completeGeneration, extractJsonObject, GroqApiError } from '@/lib/groq';
import { generationSchema, responseSchema } from '@/lib/schemas';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * POST /api/generate
 * Generates a LinkedIn publication via the Groq API (Llama-3.3-70b).
 * Requires Clerk authentication. Includes validation, rate limiting, caching, and output validation.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const { limited, remaining } = await checkRateLimit(userId);
    if (limited) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter une minute.' },
        {
          status: 429,
          headers: { 'Retry-After': '60' },
        }
      );
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      console.error('[API] GROQ_API_KEY non configurée');
      return NextResponse.json(
        { error: 'Erreur de configuration serveur.' },
        { status: 500 }
      );
    }

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

    const params = validation.data;
    const cacheKey = JSON.stringify(params);
    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) {
      return NextResponse.json({ ...cachedResponse, _cached: true });
    }

    const start = Date.now();
    console.log(
      `[API] Génération lancée — user: ${userId}, mode: ${params.mode}`
    );

    let content: string;
    try {
      content = await completeGeneration(apiKey, params);
    } catch (error) {
      if (error instanceof GroqApiError) {
        return NextResponse.json(
          { error: "L'IA est temporairement indisponible. Veuillez réessayer." },
          { status: 503 }
        );
      }
      throw error;
    }

    const parsedContent = extractJsonObject(content);
    const resultValidation = responseSchema.safeParse(parsedContent);

    if (!resultValidation.success) {
      console.error(
        '[API] Erreur de validation:',
        resultValidation.error.issues
      );
      return NextResponse.json(
        { error: 'Format de réponse IA invalide.' },
        { status: 500 }
      );
    }

    await setCachedResponse(cacheKey, resultValidation.data);
    const duration = Date.now() - start;
    console.log(`[API] Succès — Durée: ${duration}ms`);

    return NextResponse.json(resultValidation.data, {
      headers: {
        'X-Response-Time': `${duration}ms`,
        'X-Rate-Limit-Remaining': String(remaining),
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
