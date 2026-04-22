import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.liveConfig.findUnique({
      where: { id: 'main-live' }
    });
    
    // Devolvemos el objeto tal cual lo espera el front
    return NextResponse.json(config || { isLive: false, youtubeId: '', title: '' });
  } catch (error) {
    return NextResponse.json({ isLive: false }, { status: 500 });
  }
}

// POST: Para que el Pastor guarde el nuevo link desde el admin
export async function POST(req: Request) {
  const { url } = await req.json();
  const updated = await prisma.liveConfig.upsert({
    where: { id: 'current-live' },
    update: { url },
    create: { id: 'current-live', url },
  });
  return NextResponse.json(updated);
}