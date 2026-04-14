import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const nuevoBlog = await Blog.create({
      title: body.title,
      categoryId: body.categoryId,
      description: body.description,
      imageUrl: body.imageUrl, // Aquí se guarda el Base64 (texto de la imagen)
      readingTime: body.readingTime || '5 min',
      videoUrl: body.videoUrl,
      content: body.content,
    });

    return NextResponse.json(nuevoBlog, { status: 201 });
  } catch (error: any) {
    console.error("Error API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Asegúrate de que tu modelo Blog en Mongoose tenga 'ref: Category'
    const blogs = await Blog.find()
      .populate('categoryId') 
      .sort({ createdAt: -1 });
      
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("Error al obtener blogs:", error.message);
    return NextResponse.json([], { status: 500 });
  }
}