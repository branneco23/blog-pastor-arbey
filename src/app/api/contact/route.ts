import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, subject, description } = await req.json();

    // 1. Verificación de variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("ERROR: EMAIL_USER o EMAIL_PASS no definidos en el archivo .env");
      return NextResponse.json(
        { error: "Configuración del servidor incompleta" },
        { status: 500 }
      );
    }

    // 2. Configuración del transporte (Optimizado para Gmail personal)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Las 16 letras sin espacios
      },
    });

    // 3. Diseño del correo electrónico
    const mailOptions = {
      from: `"Portal de Orientación" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Te llega a ti mismo (o al correo configurado)
      subject: `🙏 Nueva Solicitud: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">Nueva Consulta Pastoral</h1>
          </div>
          <div style="padding: 24px; color: #334155;">
            <p style="margin-bottom: 8px;"><strong>Nombre del solicitante:</strong></p>
            <p style="background-color: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 0;">${name}</p>
            
            <p style="margin-bottom: 8px;"><strong>Asunto:</strong></p>
            <p style="background-color: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 0;">${subject}</p>
            
            <p style="margin-bottom: 8px;"><strong>Descripción de la necesidad:</strong></p>
            <div style="background-color: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 0; white-space: pre-wrap;">
              ${description}
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
            Este mensaje fue enviado desde el formulario de contacto del Blog Pastoral.
          </div>
        </div>
      `,
    };

    // 4. Envío del correo
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Mensaje enviado con éxito" }, { status: 200 });
    
  } catch (error: any) {
    console.error("----- ERROR EN EL SERVIDOR DE CORREO -----");
    console.error("Causa:", error.message);
    
    return NextResponse.json(
      { error: "No se pudo enviar el correo. Inténtelo más tarde." },
      { status: 500 }
    );
  }
}