import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post } from '@/models/Post';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    // Extraemos el tipo de reacción del cuerpo de la petición
    const data = await req.json();
    const { type } = data; // 'amen' o 'gracias'

    // El id viene de los parámetros de la URL ([id])
    const postId = params.id;

    // Actualizamos usando el operador $inc de MongoDB para evitar colisiones
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { [`reactions.${type}`]: 1 } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ error: "Post no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error en Reacción:", error);
    return NextResponse.json({ error: "Error al procesar reacción" }, { status: 500 });
  }
}