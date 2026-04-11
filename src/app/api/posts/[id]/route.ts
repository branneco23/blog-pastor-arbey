// src/app/api/admin/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

// Definimos el tipo del contexto según lo que pide Next.js
type Context = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    await connectDB();

    // 1. EXTRAER EL ID: Debes usar 'await' con params
    const { id } = await params;
    
    // 2. OBTENER LOS DATOS:
    const data = await request.json();

    // 3. ACTUALIZAR EN MONGO:
    const updatedBlog = await Blog.findByIdAndUpdate(id, data, { new: true });

    if (!updatedBlog) {
      return NextResponse.json({ error: "No se encontró el blog" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    console.error("Error en PUT /api/admin/posts/[id]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}