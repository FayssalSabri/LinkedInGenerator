import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/db';

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

    const body = await req.json();
    const { mode, description, brief, tone, draft, publication, note } = body;

    if (!publication || !note) {
      return NextResponse.json(
        { error: 'Publication et note sont requis.' },
        { status: 400 }
      );
    }

    const item = await prisma.historyItem.create({
      data: {
        userId,
        mode: mode || null,
        description: description || null,
        brief: brief || null,
        tone: tone || null,
        draft: draft || null,
        publication,
        note,
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
