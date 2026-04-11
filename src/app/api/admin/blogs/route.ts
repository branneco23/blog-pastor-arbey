import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function POST(req: Request) {
  try {
    // ✅ CORRECCIÓN: Ahora debes esperar a que las cookies carguen
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const data = await req.json();

    // Generación de slug (asegúrate de que esto coincida con tu lógica)
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    const newBlog = await Blog.create({
      ...data,
      slug
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    console.error("ERROR EN POST BLOGS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al cargar" }, { status: 500 });
  }
}