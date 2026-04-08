import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/Schema';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // Extraemos los datos del registro
    const { name, email, password } = await req.json();

    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    // 2. Encriptar la contraseña (importante por seguridad)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Por defecto rol de usuario normal
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