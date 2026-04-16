import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    console.log("Intentando conectar a MongoDB...");
    await connectDB();
    
    console.log("Buscando categorías...");
    const categories = await Category.find({});
    
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("DETALLE DEL ERROR 500:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
    }

    const newCategory = await Category.create({ name });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Error en la API de categorías:", error);
    // Si el error es por nombre duplicado
    if (error.code === 11000) {
      return NextResponse.json({ error: "Esa categoría ya existe" }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}