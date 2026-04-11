import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

// Definimos la interfaz exacta que Next.js espera para el contexto
// Nota: 'params' es obligatoriamente una Promesa en Next.js 15+
type Context = {
  params: Promise<{ id: string }>;
};

// --- MÉTODO GET ---
export async function GET(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params; // Siempre usar await aquí

    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- MÉTODO PUT ---
export async function PUT(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const data = await request.json();

    const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- MÉTODO DELETE ---
export async function DELETE(request: NextRequest, context: Context) {
  try {
    await connectDB();
    const { id } = await context.params;

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}