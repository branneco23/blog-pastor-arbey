import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const { name } = await req.json();
  const slug = name.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const updated = await Category.findByIdAndUpdate(id, { name, slug }, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  await Category.findByIdAndDelete(id);
  return NextResponse.json({ message: "Categoría eliminada" });
}