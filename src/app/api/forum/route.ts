import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ajusta según tu config de prisma

export async function GET() {
  try {
    const comentarios = await prisma.forum.findMany({
      where: { parentId: null }, // Traemos los hilos principales
      include: {
        respuestas: {
          include: { respuestas: true }, // Traemos subcomentarios
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comentarios);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar foro" },
      { status: 500 },
    );
  }
}

// src/app/api/forum/route.ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { texto, parentId, usuarioName, usuarioRole } = body;

    const nuevo = await prisma.forum.create({
      data: {
        texto,
        parentId: parentId || null,
        usuarioName,
        usuarioRole,
        // Si el usuario es admin, el mensaje se acepta automáticamente
        estado: usuarioRole === "admin" ? "aceptado" : "pendiente",
      },
    });

    return NextResponse.json(nuevo);
  } catch (error) {
    console.error("Error al crear mensaje en foro:", error);
    return NextResponse.json({ error: "Error al publicar" }, { status: 500 });
  }
}
