import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, newPassword } = await req.json();

    // Buscar usuario con token válido y que no haya expirado
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (user) {
      user.password = await bcrypt.hash(newPassword, 10); // Solo cambiamos esto
      user.resetToken = null; // Limpiamos el token
      user.resetTokenExpiry = null; // Limpiamos la expiración
      await user.save(); // El campo 'rol' ni se menciona, por lo tanto queda intacto.
    }

    // Encriptar nueva clave
    user.password = await bcrypt.hash(newPassword, 10);

    // Limpiar campos de recuperación
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return NextResponse.json({ message: "Contraseña actualizada con éxito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
