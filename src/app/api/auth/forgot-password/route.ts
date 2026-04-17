import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import { sendResetEmail } from '@/lib/mail';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Si el correo existe, se enviará un enlace." }, { status: 200 });
    }

    // Generar token aleatorio
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hora desde ahora

    // Guardar en la DB sin afectar el rol
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Enviar el correo
    await sendResetEmail(user.email, resetToken);

    return NextResponse.json({ message: "Enlace de recuperación enviado." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}