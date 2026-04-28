import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

// Obtener comentarios
export async function GET(req: Request, { params }: { params: any }) {
  try {
    const { id: blogId } = await params;
    await connectDB();

    const comments = await Comment.find({ blogId, estado: 'activo' })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Normalizamos para que el frontend siempre encuentre "userId.name"
    const normalized = comments.map((c: any) => ({
      _id: c._id,
      content: c.content,
      createdAt: c.createdAt,
      userId: c.userId ? c.userId : { name: 'Usuario' },
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 });
  }
}

// Crear comentario
export async function POST(req: Request, { params }: { params: any }) {
  try {
    const { id: blogId } = await params;
    const { content, userId } = await req.json();
    await connectDB();

    if (!content || !userId) {
      return NextResponse.json({ message: 'Faltan datos' }, { status: 400 });
    }

    const newComment = await Comment.create({
      content,
      userId,
      blogId, // Importante: vincular al blog de la URL
      estado: 'activo'
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al crear comentario' }, { status: 400 });
  }
}