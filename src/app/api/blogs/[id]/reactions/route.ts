import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, type } = await req.json(); // type: "LIKE" o "DISLIKE"
    const blogId = params.id;

    // Verificar si ya existe una reacción
    const existing = await prisma.reaction.findUnique({
      where: { blogId_userId: { blogId, userId } }
    });

    if (existing) {
      if (existing.type === type) {
        await prisma.reaction.delete({ where: { id: existing.id } });
        return NextResponse.json({ message: "Eliminada" });
      } else {
        await prisma.reaction.update({
          where: { id: existing.id },
          data: { type }
        });
        return NextResponse.json({ message: "Actualizada" });
      }
    }

    const newReaction = await prisma.reaction.create({
      data: { type, blogId, userId }
    });

    return NextResponse.json(newReaction);
  } catch (error) {
    return NextResponse.json({ error: "Error en reacción" }, { status: 500 });
  }
}