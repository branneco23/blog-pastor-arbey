import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Reaccion from "@/models/Reaccion"; 
import Comment from "@/models/Comment"; // Asegúrate de que el modelo se llame Comment
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

// OBTENER TODOS LOS USUARIOS CON ACTIVIDAD COMPLETA
export async function GET() {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Mapeamos cada usuario para traer su actividad de diferentes colecciones
    const usersWithActivity = await Promise.all(
      users.map(async (user: any) => {
        const [reacciones, comentarios, testimonios] = await Promise.all([
          Reaccion.find({ userId: user._id }).populate("blogId", "title").lean(),
          Comment.find({ userId: user._id }).populate("blogId", "title").lean(),
          Testimonio.find({ userId: user._id }).lean()
        ]);

        return {
          ...user,
          reacciones,
          comentarios,
          testimonios,
          totalActividad: reacciones.length + comentarios.length + testimonios.length
        };
      })
    );

    return NextResponse.json(usersWithActivity);
  } catch (error) {
    console.error("Error en GET Users:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// ACTUALIZAR ESTADO (Bloquear/Activar)
export async function PUT(req: Request) {
  try {
    await connectDB();
    
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId, nuevoEstado } = await req.json();

    if (!userId || !nuevoEstado) {
      return NextResponse.json({ error: "Datos insuficientes" }, { status: 400 });
    }

    // Actualizamos el campo 'estado' (activo/baneado)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { estado: nuevoEstado }, 
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
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
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    // 1. Eliminar al usuario
    await User.findByIdAndDelete(userId);
    
    // 2. Limpieza total de su actividad (Integridad de la DB)
    await Promise.all([
      Reaccion.deleteMany({ userId }),
      Comment.deleteMany({ userId }),
      Testimonio.deleteMany({ userId })
    ]);

    return NextResponse.json({ message: "Usuario y toda su actividad eliminados permanentemente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}