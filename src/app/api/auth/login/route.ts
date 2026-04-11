import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import dbConnect from "@/lib/db"; // Asegúrate de que esta sea la ruta a tu db.ts o mongodb.ts
import User from "@/models/User"; // Tu modelo de Mongoose
import bcrypt from "bcryptjs"; // Para comparar la contraseña real con la encriptada

export async function POST(req: Request) {
  try {
    await dbConnect(); // 1. Conectar a MongoDB
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    // En src/app/api/auth/login/route.ts
    const userFound = await User.findOne({ email }).select("+password");

    if (!userFound) {
      return NextResponse.json(
        { error: "El usuario no está registrado" },
        { status: 401 },
      );
    }

    // 3. Verificar si la contraseña coincide
    // Si tus contraseñas en la DB están encriptadas con bcrypt:
    const isMatch = await bcrypt.compare(password, userFound.password);

    // Si NO están encriptadas (solo para pruebas, no recomendado), usa:
    // const isMatch = userFound.password === password;

    if (!isMatch) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 },
      );
    }

    // 4. Preparar datos del usuario desde la DB
    const userPayload = {
      id: userFound._id,
      name: userFound.name,
      role: userFound.role, // Aquí tomará el 'admin' o 'user' real de MongoDB
      email: userFound.email,
    };

    const token = await signToken(userPayload);

    // 5. Enviar respuesta con los datos reales
    const response = NextResponse.json({
      success: true,
      user: userPayload, // Enviamos el objeto 'user' completo para que el AuthModal lo guarde
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // true en producción
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
