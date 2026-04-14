// Cambiamos la ruta para que apunte a tu archivo real y usamos el nombre correcto
import { connectDB } from '@/lib/db'; 
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Usamos tu función existente
    await connectDB();

    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error en API de usuarios:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los usuarios" }, 
      { status: 500 }
    );
  }
}