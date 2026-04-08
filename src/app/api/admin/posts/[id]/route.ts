import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post } from '@/models/Post';
import { isAdmin } from '@/lib/auth-check';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  // ... resto del código para borrar
}

// EDITAR BLOG
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();
  const updated = await Post.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

