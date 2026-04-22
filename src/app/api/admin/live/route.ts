import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const config = await prisma.liveConfig.findUnique({
      where: { id: 'main-live' }
    });
    return NextResponse.json(config || { isLive: false, youtubeId: '', title: '' });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { isLive, youtubeId, title } = body;

    // Validación básica para evitar guardar datos vacíos
    if (!youtubeId && isLive) {
      return NextResponse.json({ error: "Falta el ID de YouTube" }, { status: 400 });
    }

    const config = await prisma.liveConfig.upsert({
      where: { id: 'main-live' },
      update: {
        isLive,
        youtubeId,
        title: title || "Transmisión en Vivo",
      },
      create: {
        id: 'main-live',
        isLive,
        youtubeId,
        title: title || "Transmisión en Vivo",
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("DEBUG PRISMA ERROR:", error);
    return NextResponse.json({ error: "Fallo en la base de datos" }, { status: 500 });
  }
}