import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // SIN LLAVES
import User from '@/models/User'; // USA ESTE MODELO (No Schema)
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "El correo ya existe" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
  }
}