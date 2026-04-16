import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Post } from '@/models/Post';

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const slug = data.title.toLowerCase().split(' ').join('-');
    const newPost = await Post.create({ ...data, slug });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}