import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/models/Schema";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = await verifyToken(token!);

    // Solo eliminamos si el blog pertenece al autor que hace la petición
    const blog = await Blog.findOneAndDelete({ 
      _id: id, 
      authorId: payload.id 
    });

    if (!blog) {
      return NextResponse.json({ error: "No encontrado o no autorizado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Eliminado con éxito" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}