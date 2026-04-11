import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Usamos el cliente de Prisma configurado
import { cookies } from 'next/headers';

// Manejador para crear blogs (POST)
export async function POST(req: Request) {
  try {
    // 1. Verificación de Autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Obtener datos del cuerpo de la petición
    const body = await req.json();
    const { title, content, description, readingTime, imageUrl, categoryId } = body;

    // 3. Creación en MongoDB usando Prisma
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        description: description || "",
        readingTime: readingTime || "5 min",
        imageUrl: imageUrl || "",
        // Conexión con la categoría (asegúrate de que el ID sea válido)
        category: {
          connect: { id: categoryId }
        }
      },
    });

    return NextResponse.json(newBlog, { status: 201 });

  } catch (error: any) {
    console.error("❌ ERROR POST BLOG:", error);
    return NextResponse.json(
      { error: "Error al crear el blog: " + error.message }, 
      { status: 500 }
    );
  }
}

// Manejador para listar blogs (GET)
export async function GET() {
  try {
    // Obtenemos los blogs incluyendo la información de su categoría
    const blogs = await prisma.blog.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("❌ ERROR GET BLOGS:", error);
    return NextResponse.json(
      { error: "Error al obtener datos" }, 
      { status: 500 }
    );
  }
}