import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name } = await req.json();
    
    // Crear en la BD
    const doc = await Category.create({ name });
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const cats = await Category.find({});
  return NextResponse.json(cats);
}