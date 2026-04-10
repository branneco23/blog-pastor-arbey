import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

// 🔥 CREAR BLOG
export async function POST(req: Request) {
  try {
    await connectDB();

    // ✅ Obtener token correctamente
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();

    // ✅ Generar slug
    const slug = body.title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    // ✅ Crear blog
    const newBlog = await Blog.create({
      title: body.title,
      description: body.description,
      content: body.content,
      image: body.image,
      category: body.category,
      readingTime: body.readingTime,
      slug,
      authorEmail: payload.email, // 🔥 CAMBIO IMPORTANTE
      authorName: payload.name,
    });

    return NextResponse.json(newBlog, { status: 201 });

  } catch (error: any) {
    console.error("Error creando blog:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 🔥 LISTAR BLOGS (DEL USUARIO)
export async function GET() {
  try {
    await connectDB();

    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json([], { status: 200 });
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json([], { status: 200 });
    }

    const blogs = await Blog.find({
      authorEmail: payload.email
    }).sort({ createdAt: -1 });

    return NextResponse.json(blogs);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}