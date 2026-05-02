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
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    
    const payload = await verifyToken(token);
    // Verificamos que el payload exista y tenga el rol de admin
    return payload && payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

// OBTENER TODOS LOS USUARIOS CON ACTIVIDAD
export async function GET() {
  try {
    await connectDB();
    
    // Filtramos para no traer admins y seleccionamos campos necesarios
    // Incluimos isBlocked para que el frontend sepa el estado actual
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const dataFull = await Promise.all(
      users.map(async (user: any) => {
        const [comentarios, reacciones] = await Promise.all([
          Comment.find({ userId: user._id }).populate("blogId", "title").lean(),
          Reaccion.find({ userId: user._id }).populate("blogId", "title").lean(),
        ]);

        return {
          ...user,
          // Aseguramos que isBlocked siempre tenga un valor booleano
          isBlocked: !!user.isBlocked,
          actividad: {
            comentarios,
            reacciones,
            total: (comentarios?.length || 0) + (reacciones?.length || 0),
          },
        };
      }),
    );

    return NextResponse.json(dataFull);
  } catch (error) {
    console.error("Error en GET Users:", error);
    return NextResponse.json({ error: "Error al obtener la lista de usuarios" }, { status: 500 });
  }
}

// ACTUALIZAR ESTADO (Bloquear/Activar)
export async function PUT(req: Request) {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado. Se requieren permisos de administrador." }, { status: 401 });
    }

    const body = await req.json();
    const { userId, isBlocked } = body;

    // Validación estricta de datos
    if (!userId || typeof isBlocked !== 'boolean') {
      return NextResponse.json(
        { error: "Datos insuficientes: userId (string) e isBlocked (boolean) son requeridos" },
        { status: 400 },
      );
    }

    // Actualizamos el usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isBlocked: isBlocked }, 
      { new: true, runValidators: true } // runValidators asegura que el esquema se respete
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: isBlocked ? "Usuario suspendido correctamente" : "Usuario activado correctamente",
      user: updatedUser 
    });
    
  } catch (error: any) {
    console.error("Error en PUT User:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el estado del usuario" },
      { status: 500 },
    );
  }
}

// ELIMINAR USUARIO Y TODA SU ACTIVIDAD (Limpieza total)
export async function DELETE(request: Request) {
  try {
    await connectDB();

    if (!(await isAdmin())) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "El ID de usuario es obligatorio" }, { status: 400 });
    }

    // Buscamos si existe antes de borrar
    const userExists = await User.findById(userId);
    if (!userExists) {
      return NextResponse.json({ error: "El usuario ya no existe" }, { status: 404 });
    }

    // Ejecutamos todas las eliminaciones en paralelo para mayor velocidad
    await Promise.all([
      User.findByIdAndDelete(userId),
      Reaccion.deleteMany({ userId }),
      Comment.deleteMany({ userId }),
      Testimonio.deleteMany({ userId }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Usuario y toda su actividad (comentarios, reacciones, testimonios) han sido eliminados.",
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return NextResponse.json({ error: "Error al procesar la eliminación permanente" }, { status: 500 });
  }
}