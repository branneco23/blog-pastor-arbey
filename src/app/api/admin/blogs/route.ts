import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post } from '@/models/Schema'; // Usamos tu modelo principal
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // 1. Validar Token y obtener ID del autor
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await req.json();

    // 2. Generar slug automático a partir del título
    // "La Unidad de Dios" -> "la-unidad-de-dios"
    const slug = body.title
      .toLowerCase()
      .trim()
      .normalize('NFD') // Elimina acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    // 3. Crear el Post en la base de datos
    const newPost = await Post.create({
      title: body.title,
      description: body.description,
      content: body.content,
      image: body.image,
      videoUrl: body.videoUrl,
      category: body.category,
      readingTime: body.readingTime,
      slug: slug,
      authorId: payload.id, // Vinculamos el ID del autor extraído del JWT
    });

    return NextResponse.json(newPost, { status: 201 });

  } catch (error: any) {
    console.error("Error creando post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 4. Agregar método GET para listar los blogs del usuario
export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return NextResponse.json([], { status: 401 });
    
    const payload = await verifyToken(token);
    
    // Traemos solo los posts creados por este usuario
    const posts = await Post.find({ authorId: payload?.id }).sort({ createdAt: -1 });
    
    return NextResponse.json(posts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}