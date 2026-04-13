import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

// En tu archivo de la API (POST o PUT)
export async function POST(req: Request) {
  const body = await req.json();

  // No hagas esto: const img = body.imageUrl[0];
  // Haz esto:
  const newBlog = await Blog.create({
    ...body,
    imageUrl: body.imageUrl, // Aquí ya viaja el array que enviamos desde el formulario
  });

  return NextResponse.json(newBlog);
}

// GET: Obtener un blog específico
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 👈 IMPORTANTE: Desenvolver params con await
    const { id } = await params;

    await connectDB();
    const blog = await Blog.findById(id).populate("categoryId");

    if (!blog) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Eliminar un blog
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // 👈 Desenvolver params

    await connectDB();
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Es vital que params sea tratado como una Promesa
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    
    // 1. DESENVOLVER PARAMS (La solución al error 500)
    const { id } = await params; 
    
    const body = await req.json();

    // 2. ACTUALIZAR (Usando returnDocument para evitar el Warning de Mongoose)
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...body }, 
      { 
        returnDocument: 'after', // Reemplaza a new: true
        runValidators: true 
      }
    );

    if (!updatedBlog) {
      return NextResponse.json({ error: "Enseñanza no encontrada" }, { status: 404 });
    }

    return NextResponse.json(updatedBlog);
  } catch (error: any) {
    console.error("Error detallado en la API:", error);
    
    // Si el error es por el tamaño de las imágenes
    if (error.type === 'entity.too.large') {
      return NextResponse.json({ error: "Las imágenes son muy pesadas" }, { status: 413 });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
