import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // Ajusta según tu carpeta lib
import User from "@/models/User"; // Ajusta según tu carpeta models
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    // 1. Validar el Admin (Opcional para pruebas, pero recomendado)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "No hay token" }, { status: 401 });

    // 2. Buscar en la base de datos 'blog-arbey' -> colección 'users'
    const users = await User.find({}).select("-password");

    console.log("Usuarios encontrados:", users.length); // Esto saldrá en tu terminal de VS Code
    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error en GET /api/admin/users:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// ESTO ES PARA ACTUALIZAR (PUT) - El botón de Ban/Activar
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { userId, updateData } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status: updateData.status },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// ELIMINAR
export async function DELETE(request: Request) {
  await connectDB();
  const { userId } = await request.json();
  await User.findByIdAndDelete(userId);
  return NextResponse.json({ message: "Usuario eliminado" });
}
