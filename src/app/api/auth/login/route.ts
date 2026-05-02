import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import User from "@/models/User"; 
import bcrypt from "bcryptjs"; 
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB(); 
    const { email, password } = await req.json();

    // 1. Validaciones de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // 2. Buscar usuario
    // IMPORTANTE: Seleccionamos 'isBlocked' para que coincida con tu panel de admin
    const userFound = await User.findOne({ email }).select("+password +isBlocked");

    if (!userFound) {
      return NextResponse.json(
        { error: "El usuario no está registrado" },
        { status: 401 },
      );
    }

    // 3. VALIDACIÓN DE BLOQUEO (Unificada con el Panel de Admin)
    // Usamos 'isBlocked' que es el booleano que manejas en la base de datos
    if (userFound.isBlocked === true) {
      return NextResponse.json(
        { error: "Esta cuenta ha sido suspendida por conducta indebida. Contacta al administrador." }, 
        { status: 403 } // Forbidden
      );
    }

    // 4. Verificar contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    // 5. Preparar datos del usuario
    const userPayload = {
      id: userFound._id.toString(),
      name: userFound.name,
      role: userFound.role, 
      email: userFound.email,
    };

    const token = await signToken(userPayload);

    // 6. Configurar respuesta y Cookie
    const response = NextResponse.json({
      success: true,
      user: userPayload, 
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
      secure: process.env.NODE_ENV === "production",
    });

    return response;

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}