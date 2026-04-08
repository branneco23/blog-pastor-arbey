import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post } from '@/models/Post'; // Reutilizamos la colección o creamos una Config

export async function GET() {
  await connectDB();
  // Buscamos un documento que guarde la config global
  const liveStatus = await Post.findOne({ isGlobalConfig: true });
  return NextResponse.json(liveStatus || { isLive: false, youtubeId: '' });
}

export async function POST(req: Request) {
  await connectDB();
  const { isLive, youtubeId, title } = await req.json();
  
  const updated = await Post.findOneAndUpdate(
    { isGlobalConfig: true },
    { isLive, youtubeId, title, isGlobalConfig: true },
    { upsert: true, new: true }
  );
  
  return NextResponse.json(updated);
}