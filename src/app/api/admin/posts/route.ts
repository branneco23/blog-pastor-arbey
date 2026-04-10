import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/db';
import Blog from '@/models/Blog';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newBlog = await Blog.create(body);
    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}