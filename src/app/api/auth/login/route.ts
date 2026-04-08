import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/Schema'; // Usando tu modelo Schema
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/jwt'; 
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Conexión a la base de datos
    await connectDB();
    
    const { email, password } = await req.json();

    // 2. Buscar usuario (usamos select('+password') por si lo tienes oculto en el schema)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" }, 
        { status: 401 }
      );
    }

    // 3. Verificar si el usuario está activo (Importante para tu control de usuarios)
    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: "Tu cuenta ha sido suspendida. Contacta al administrador." }, 
        { status: 403 }
      );
    }

    // 4. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" }, 
        { status: 401 }
      );
    }

    // 5. Crear el Token firmado con la lógica de lib/jwt.ts
    const token = await createToken({ 
      id: user._id.toString(), 
      role: user.role, 
      email: user.email 
    });

    // 6. Configurar la Cookie (Usando la sintaxis moderna de Next.js)
    const cookieStore = await cookies();
    cookieStore.set('token', token, { 
      httpOnly: true, // Bloquea acceso desde JavaScript (Protección XSS)
      secure: process.env.NODE_ENV === 'production', 
      path: '/',
      maxAge: 60 * 60 * 24, // Expira en 24 horas
      sameSite: 'lax'
    });

    // 7. Respuesta exitosa con datos de sesión para el Contexto de React
    return NextResponse.json({ 
      message: "Bienvenido de nuevo", 
      user: {
        id: user._id,
        role: user.role, 
        name: user.name,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error("Login Error:", error.message);
    return NextResponse.json(
      { error: "Error interno en el proceso de autenticación" }, 
      { status: 500 }
    );
  }
}