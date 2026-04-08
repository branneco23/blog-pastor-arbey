import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/Schema"; 
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // 1. Buscar usuario
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 2. Verificar estado de cuenta
    if (user.status === "suspended") {
      return NextResponse.json(
        { error: "Tu cuenta ha sido suspendida. Contacta al administrador." },
        { status: 403 }
      );
    }

    // 3. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // 4. Crear el Token JWT
    const token = await createToken({
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    });

    // 5. Crear la respuesta y adjuntar la Cookie
    // Usamos esta forma porque es la más compatible con el Middleware en Next.js App Router
    const response = NextResponse.json({
      message: "Bienvenido de nuevo",
      name: user.name, // Importante: Enviamos el nombre directamente
      role: user.role, // Importante: Enviamos el rol directamente
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: "/",
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error.message);
    return NextResponse.json(
      { error: "Error interno en el proceso de autenticación" },
      { status: 500 }
    );
  }
}