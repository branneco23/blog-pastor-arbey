import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog'; // O Post, según uses en este archivo

type Context = {
  params: Promise<{ id: string }>;
};

// GET: Obtener un post individual
export async function GET(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener" }, { status: 500 });
  }
}

// PUT: Este es el que te estaba pidiendo el Build
export async function PUT(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();

    const actualizado = await Blog.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    if (!actualizado) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// DELETE: El que ya tenías bien
export async function DELETE(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const eliminado = await Blog.findByIdAndDelete(id);

    if (!eliminado) {
      return NextResponse.json({ error: "Blog no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Blog eliminado correctamente" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}