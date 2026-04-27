import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import User from "@/models/User"; // Tu modelo de Mongoose
import bcrypt from "bcryptjs"; 
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB(); // 1. Conectar a MongoDB
    const { email, password } = await req.json();

    // 1. Validaciones de entrada
    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // 2. Buscar usuario (incluyendo password y el campo estado para el bloqueo)
    const userFound = await User.findOne({ email }).select("+password +estado");

    if (!userFound) {
      return NextResponse.json(
        { error: "El usuario no está registrado" },
        { status: 401 },
      );
    }

    // 3. VALIDACIÓN DE BLOQUEO (Crucial para el Panel de Usuarios)
    // Comprobamos si el estado es 'bloqueado' o 'baneado' según definiste en el PUT
    if (userFound.estado === "bloqueado" || userFound.estado === "baneado") {
      return NextResponse.json(
        { error: "Esta cuenta ha sido bloqueada por el administrador." }, 
        { status: 403 } // Forbidden
      );
    }

    // 4. Verificar si la contraseña coincide
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    // 5. Preparar datos del usuario para el Token y el Frontend
    const userPayload = {
      id: userFound._id.toString(), // Convertimos el ObjectId a string
      name: userFound.name,
      role: userFound.role, 
      email: userFound.email,
    };

    const token = await signToken(userPayload);

    // 6. Configurar respuesta con datos de usuario y Cookie de sesión
    const response = NextResponse.json({
      success: true,
      user: userPayload, 
    });

    response.cookies.set("token", token, {
      httpOnly: true, // Seguridad: no accesible desde JS del navegador
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días de duración
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