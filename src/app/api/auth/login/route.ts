import { NextResponse } from 'next/server';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🔥 Usuario simulado dinámico
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    // 👇 AQUÍ defines quién es admin
    const isAdmin = email === 'admin@test.com';

    const user = {
      name: email.split('@')[0],
      role: isAdmin ? 'admin' : 'user',
      email
    };

    const token = await signToken(user);

    const response = NextResponse.json({
      name: user.name,
      role: user.role
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: false
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}