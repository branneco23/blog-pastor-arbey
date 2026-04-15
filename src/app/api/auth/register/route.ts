import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Sin llaves si es export default
import User from '@/models/User'; // Usa el modelo consistente
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    return NextResponse.json({ 
      message: "Usuario creado exitosamente",
      userId: newUser._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Error en Registro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}