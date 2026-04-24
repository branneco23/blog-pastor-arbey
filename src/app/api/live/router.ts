// src/app/api/live/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const liveStatus = await prisma.liveConfig.findFirst();
    return NextResponse.json(liveStatus || { isLive: false });
  } catch (error) {
    console.error("Error de conexión con MongoDB:", error);
    // IMPORTANTE: Devolvemos un 200 manual para no romper el Navbar
    return NextResponse.json({ isLive: false, status: "offline" }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { isLive, youtubeId, title } = body;

    // Validación básica para evitar guardar datos vacíos
    if (!youtubeId && isLive) {
      return NextResponse.json(
        { error: "Falta el ID de YouTube" },
        { status: 400 },
      );
    }

    const config = await prisma.liveConfig.upsert({
      where: { id: "main-live" },
      update: {
        isLive,
        youtubeId,
        title: title || "Transmisión en Vivo",
      },
      create: {
        id: "main-live",
        isLive,
        youtubeId,
        title: title || "Transmisión en Vivo",
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("DEBUG PRISMA ERROR:", error);
    return NextResponse.json(
      { error: "Fallo en la base de datos" },
      { status: 500 },
    );
  }
}
