import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';
import { historyCreateSchema } from '@/lib/schemas';
import { z } from 'zod';

/**
 * GET /api/history
 * Returns all history items for the authenticated user, ordered by most recent.
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const items = await prisma.historyItem.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('[API/history] GET error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/history
 * Saves a new history item for the authenticated user.
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
    }

    const validation = historyCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { mode, description, brief, tone, draft, publication, note, image } =
      validation.data;

    const item = await prisma.historyItem.create({
      data: {
        userId,
        mode: mode ?? null,
        description: description ?? null,
        brief: brief ?? null,
        tone: tone ?? null,
        draft: draft ?? null,
        publication,
        note,
        image: image ?? null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('[API/history] POST error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'JSON invalide.' }, { status: 400 });
    }

    const patchSchema = z.object({
      id: z.string().uuid(),
      image: z.string().max(5000000).optional().nullable(),
    });

    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, image } = validation.data;
    const updatedItem = await prisma.historyItem.updateMany({
      where: { id, userId },
      data: { image: image ?? null },
    });

    if (updatedItem.count === 0) {
      return NextResponse.json(
        { error: 'Élément introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API/history] PATCH error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/history
 * Clears all history items for the authenticated user.
 */
export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    await prisma.historyItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API/history] DELETE error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur.' },
      { status: 500 }
    );
  }
}
