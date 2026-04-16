import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User'; // Ajusta si tu modelo se llama diferente
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificar que quien hace la petición sea ADMIN
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const payload = token ? await verifyToken(token) : null;

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Conectar y obtener datos
    await connectDB();
    const { id } = await params;
    const { status } = await req.json(); // Recibe 'active' o 'suspended'

    // 3. Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `Usuario ${status === 'active' ? 'activado' : 'suspendido'} con éxito`,
      user: updatedUser 
    });

  } catch (error: any) {
    console.error("Error en PATCH Status:", error.message);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}