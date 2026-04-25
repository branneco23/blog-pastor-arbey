import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Buscamos el registro único
    const liveStatus = await prisma.liveConfig.findUnique({
      where: { id: "main-live" }
    });
    
    // Si no existe el registro, devolvemos un objeto por defecto
    return NextResponse.json(liveStatus || { isLive: false });
  } catch (error) {
    console.error("Error al obtener LiveConfig:", error);
    return NextResponse.json({ isLive: false, error: "Database offline" }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { isLive, youtubeId, title } = body;

    // Validación: Si se intenta activar el live, el ID de Youtube es obligatorio
    if (isLive && !youtubeId) {
      return NextResponse.json(
        { error: "El ID de YouTube es obligatorio para activar el en vivo" },
        { status: 400 }
      );
    }

    // Usamos upsert para que si no existe el ID 'main-live', lo cree. Si existe, lo actualice.
    const config = await prisma.liveConfig.upsert({
      where: { id: "main-live" },
      update: {
        isLive: Boolean(isLive),
        youtubeId: youtubeId || "",
        title: title || "Transmisión en Vivo",
      },
      create: {
        id: "main-live",
        isLive: Boolean(isLive),
        youtubeId: youtubeId || "",
        title: title || "Transmisión en Vivo",
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("DEBUG PRISMA ERROR:", error);
    return NextResponse.json(
      { error: "Error al guardar en la base de datos" },
      { status: 500 }
    );
  }
}