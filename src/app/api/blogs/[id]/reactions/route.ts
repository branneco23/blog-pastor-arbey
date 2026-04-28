import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Reaccion from "@/models/Reaccion";

// Agregamos Promise<{ id: string }> al tipo de params
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    // LA CORRECCIÓN: Unwrapping params con await
    const resolvedParams = await params;
    const blogId = resolvedParams.id;

    const likes = await Reaccion.countDocuments({ blogId, type: 'LIKE' });
    const dislikes = await Reaccion.countDocuments({ blogId, type: 'DISLIKE' });

    return NextResponse.json({ likes, dislikes });
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener reacciones" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    // LA CORRECCIÓN: Unwrapping params con await
    const resolvedParams = await params;
    const blogId = resolvedParams.id;

    const { type, userId } = await req.json();

    if (!userId || !type) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const existing = await Reaccion.findOne({ blogId, userId });

    if (existing) {
      if (existing.type === type) {
        await Reaccion.findByIdAndDelete(existing._id);
      } else {
        existing.type = type;
        await existing.save();
      }
    } else {
      await Reaccion.create({ blogId, userId, type });
    }

    const likes = await Reaccion.countDocuments({ blogId, type: 'LIKE' });
    const dislikes = await Reaccion.countDocuments({ blogId, type: 'DISLIKE' });

    return NextResponse.json({ likes, dislikes });
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar reacción" }, { status: 500 });
  }
}