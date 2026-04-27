import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Reaccion from "@/models/Reaccion";
import Comment from "@/models/Comment";
import Testimonio from "@/models/Testimonio";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// Función auxiliar para verificar si es Admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload && payload.role === "admin" ? payload : null;
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .lean();

    const dataFull = await Promise.all(
      users.map(async (user: any) => {
        const [comentarios, reacciones] = await Promise.all([
          Comment.find({ userId: user._id }).populate("blogId", "title").lean(),
          Reaccion.find({ userId: user._id }).populate("blogId", "title").lean(),
        ]);

        return {
          ...user,
          actividad: {
            comentarios,
            reacciones,
            total: comentarios.length + reacciones.length,
          },
        };
      }),
    );

    return NextResponse.json(dataFull);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

// ACTUALIZAR ESTADO (Bloquear/Activar) - CORREGIDO
export async function PUT(req: Request) {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Cambiamos 'nuevoEstado' por 'isBlocked' para que coincida con tu Frontend y DB
    const { userId, isBlocked } = await req.json();

    if (!userId || typeof isBlocked === 'undefined') {
      return NextResponse.json(
        { error: "Datos insuficientes (userId e isBlocked son requeridos)" },
        { status: 400 },
      );
    }

    // Actualizamos el campo 'isBlocked' que es el que usa tu base de datos
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: isBlocked }, 
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error en PUT User:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 },
    );
  }
}

// ELIMINAR USUARIO Y TODA SU ACTIVIDAD
export async function DELETE(request: Request) {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 },
      );
    }

    await User.findByIdAndDelete(userId);

    await Promise.all([
      Reaccion.deleteMany({ userId }),
      Comment.deleteMany({ userId }),
      Testimonio.deleteMany({ userId }),
    ]);

    return NextResponse.json({
      message: "Usuario y toda su actividad eliminados permanentemente",
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}