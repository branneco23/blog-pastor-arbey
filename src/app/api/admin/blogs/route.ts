import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post } from '@/models/Schema';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Generar slug automático (Ej: "La Unidad" -> "la-unidad")
    const slug = body.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    const newPost = await Post.create({
      ...body,
      slug
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}