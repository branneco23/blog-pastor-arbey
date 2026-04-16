import connectDB from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Asegúrate de instalarlo: npm i bcryptjs

// Función para obtener usuarios (La que ya tenías)
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error al cargar" }, { status: 500 });
  }
}

// NUEVA: Función para REGISTRAR usuarios
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    // 1. Validar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    // 2. Encriptar la contraseña (Muy importante por seguridad)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear el usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return NextResponse.json({ message: "Usuario creado con éxito", user: { name, email } }, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ error: "No se pudo crear el usuario" }, { status: 500 });
  }
}