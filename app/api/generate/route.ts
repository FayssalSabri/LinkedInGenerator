import { NextResponse } from 'next/server';
import { getCachedResponse, setCachedResponse } from '@/lib/cache';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt';
import { generationSchema, responseSchema } from '@/lib/schemas';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[API] GROQ_API_KEY non configurée');
      return NextResponse.json(
        { error: 'Erreur de configuration serveur.' },
        { status: 500 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
    }

    const validation = generationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { description, brief, tone } = validation.data;
    const cacheKey = JSON.stringify({ description, brief, tone });
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) return NextResponse.json({ ...cachedResponse, _cached: true });

    const start = Date.now();
    console.log(`[API] Generation started - Tone: ${tone}`);

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
      console.error(`[API] Groq error: ${groqResponse.status}`);
      return NextResponse.json({ error: "L'IA est indisponible." }, { status: groqResponse.status });
    }

    const data = await groqResponse.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) throw new Error('Contenu vide');

    const parsedContent = JSON.parse(content);
    const resultValidation = responseSchema.safeParse(parsedContent);

    if (!resultValidation.success) {
      console.error('[API] Validation Error:', resultValidation.error.issues);
      return NextResponse.json({ error: 'Format IA invalide.' }, { status: 500 });
    }

    setCachedResponse(cacheKey, resultValidation.data);
    console.log(`[API] Success - Duration: ${Date.now() - start}ms`);

    return NextResponse.json(resultValidation.data);

  } catch (error) {
    console.error('[API] Server Error:', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
