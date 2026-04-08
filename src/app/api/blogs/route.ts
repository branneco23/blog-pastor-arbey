import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db'; // Ajusta según el nombre de tu archivo en la carpeta lib
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: 'Fallo al cargar doctrinas' }, { status: 500 });
  }
}