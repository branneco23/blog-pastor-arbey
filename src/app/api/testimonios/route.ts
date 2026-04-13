import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Asegúrate de tener tu función de conexión
import Testimonio from '@/models/Testimonio';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { title, youtubeId } = await req.json();
    
    const nuevoTestimonio = await Testimonio.create({ title, youtubeId });
    return NextResponse.json(nuevoTestimonio, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const testimonios = await Testimonio.find().sort({ createdAt: -1 });
    return NextResponse.json(testimonios);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}