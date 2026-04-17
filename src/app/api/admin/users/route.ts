import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Reaccion from "@/models/Reaccion"; // Modelo de reacciones
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// OBTENER TODOS LOS USUARIOS CON SUS REACCIONES
export async function GET() {
  try {
    await connectDB();

    // 1. Validación de Seguridad (Solo Admin)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Obtener usuarios básicos (sin password)
    const users = await User.find({})
      .lean()
      .select("-password")
      .sort({ createdAt: -1 });

    // 3. Unir con sus reacciones (Activity Mapping)
    const usersWithActivity = await Promise.all(
      users.map(async (user: any) => {
        // Buscamos todas las reacciones de este usuario específico
        const reacciones = await Reaccion.find({ userId: user._id })
          .populate("blogId", "title") // Opcional: trae el título del blog reaccionado
          .lean();

        return {
          ...user,
          reacciones, // Esto es lo que leerá tu tabla
        };
      })
    );

    return NextResponse.json(usersWithActivity);
  } catch (error) {
    console.error("Error en GET Users:", error);
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}

// ACTUALIZAR ESTADO (Activar/Bannear)
export async function PUT(req: Request) {
  try {
    await connectDB();
    
    // Verificación de Admin (Seguridad)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId, updateData } = await req.json();

    // Actualizamos solo el campo 'estado' (o status según tu modelo)
    // Usamos el nombre de campo 'estado' que es el que definimos en tu User.ts
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { estado: updateData.status }, 
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

// ELIMINAR USUARIO
export async function DELETE(request: Request) {
  try {
    await connectDB();

    // Verificación de Admin (Seguridad)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? await verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 });
    }

    await User.findByIdAndDelete(userId);
    
    // Opcional: Borrar también sus reacciones para limpiar la DB
    await Reaccion.deleteMany({ userId });

    return NextResponse.json({ message: "Usuario y actividad eliminados" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}