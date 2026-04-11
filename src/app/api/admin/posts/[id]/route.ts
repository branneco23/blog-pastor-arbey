import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deleted = await Blog.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "No se encontró" }, { status: 404 });
    }

    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}