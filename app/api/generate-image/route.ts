import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rateLimit';

const bodySchema = z.object({
  prompt: z.string().min(5, 'Prompt trop court').max(2000, 'Prompt trop long'),
  size: z.enum(['256x256', '512x512', '1024x1024']).optional(),
  // allow additional options forwarded to the worker
  options: z.record(z.string(), z.any()).optional(),
});

/**
 * POST /api/generate-image
 * Proxies an authenticated request to a Cloudflare Worker AI endpoint that generates images.
 * Expects `CF_IMAGE_WORKER_URL` (full worker URL) and optionally `CF_IMAGE_WORKER_KEY` in env.
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
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
    }

    const validation = bodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { prompt, size, options } = validation.data;

    const workerUrl = process.env.CF_IMAGE_WORKER_URL?.trim();
    const accountId = process.env.Cloudflare_Account_ID?.trim();
    const apiToken = process.env.Cloudflare_API_Token?.trim();
    const workerScript = process.env.CF_WORKER_SCRIPT_NAME?.trim();

    const payload = { prompt, size, options };

    let cfRes: Response;

    if (workerUrl) {
      const apiKey = process.env.CF_IMAGE_WORKER_KEY?.trim();
      cfRes = await fetch(workerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    } else {
      // Fallback: call the Cloudflare Workers dispatch API using account token
      if (!accountId || !apiToken || !workerScript) {
        console.error('[API] Cloudflare worker configuration manquante');
        return NextResponse.json(
          {
            error:
              'Erreur de configuration serveur. Définir CF_IMAGE_WORKER_URL ou Cloudflare_Account_ID + Cloudflare_API_Token + CF_WORKER_SCRIPT_NAME.',
          },
          { status: 500 }
        );
      }

      const dispatchUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerScript}/dispatch`;
      cfRes = await fetch(dispatchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(payload),
      });
    }

    if (!cfRes.ok) {
      const errText = await cfRes
        .text()
        .catch(() => 'Erreur Cloudflare Worker');
      console.error('[API] Cloudflare Worker error:', cfRes.status, errText);
      return NextResponse.json(
        { error: "Erreur lors de la génération d'image.", details: errText },
        { status: 502 }
      );
    }

    const contentType = cfRes.headers.get('content-type') || '';

    // If worker returned JSON, expect { imageUrl } or { b64 } or similar
    if (contentType.includes('application/json')) {
      const data = await cfRes.json();
      // prefer standard image fields, then return the full payload
      const image = data.imageUrl ?? data.b64 ?? data.image ?? data;
      return NextResponse.json({ image, _rateRemaining: remaining });
    }

    // Otherwise assume binary image data — convert to base64 data URL
    const arrayBuffer = await cfRes.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const base64 = buf.toString('base64');
    const mime = contentType.split(';')[0] || 'image/png';
    const dataUrl = `data:${mime};base64,${base64}`;
    return NextResponse.json({ image: dataUrl, _rateRemaining: remaining });
  } catch (error) {
    console.error('[API] Erreur serveur (image):', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
