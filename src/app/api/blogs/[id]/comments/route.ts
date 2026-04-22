import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, content } = await req.json();
    
    const comment = await prisma.comment.create({
      data: {
        content,
        blogId: params.id,
        userId
      },
      include: { user: true } // Para mostrar el nombre del autor de inmediato
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Error al comentar" }, { status: 500 });
  }
}