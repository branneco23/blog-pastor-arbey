import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Post } from '@/models/Post';

export async function DELETE(req: Request) {
  const { postId, commentId } = await req.json();
  await connectDB();
  
  await Post.findByIdAndUpdate(postId, {
    $pull: { comments: { _id: commentId } }
  });
  
  return NextResponse.json({ message: "Comentario removido" });
}