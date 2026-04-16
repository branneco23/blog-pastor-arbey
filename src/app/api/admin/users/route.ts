import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Asegúrate que el nombre sea mongodb.ts o db.ts
import User from "@/models/User"; // Verifica si tu modelo es 'User' o 'Schema'
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await connectDB();

    // Validación de Admin
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
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
