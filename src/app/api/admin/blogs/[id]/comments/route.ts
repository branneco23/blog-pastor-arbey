import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: blogId } = params;
    const body = await req.json();
    const { content, authorId } = body;

    // Validación de seguridad
    if (!content || !authorId) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        content,
        blogId,
        authorId, // Este es el campo que ahora Prisma ya reconoce
      },
      include: {
        author: true // Para devolver el nombre del usuario inmediatamente
      }
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("ERROR EN MONGO:", error);
    return NextResponse.json({ error: "Error al guardar el comentario" }, { status: 500 });
  }
}