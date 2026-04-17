import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para puerto 465
  auth: {
    user: process.env.EMAIL_USER, // Tu correo
    pass: process.env.EMAIL_PASS, // LA CLAVE DE APLICACIÓN DE 16 LETRAS
  },
});

export const sendResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Blog Pastor Arbey" <no-reply@tu-app.com>',
    to: email,
    subject: "Restablecer Contraseña - Blog Arbey Bustamante",
    html: `
      <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2>Hola,</h2>
        <p>Has solicitado restablecer tu contraseña para el Blog.</p>
        <p>Haz clic en el siguiente botón para continuar. Este enlace expira en 1 hora.</p>
        <a href="${resetUrl}" style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste esto, ignora este correo.</p>
      </div>
    `,
  });
};