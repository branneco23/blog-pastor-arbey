import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers'; // Asegúrate de que la importación esté así

// Manejador para crear blogs (POST)
export async function POST(req: Request) {
  try {
    // ✅ CORRECCIÓN: Ahora cookies() requiere await
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // ... resto de tu lógica de guardado
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Manejador para listar blogs (GET)
export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}