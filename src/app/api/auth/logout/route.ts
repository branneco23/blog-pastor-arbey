import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session'); // Borra la llave de acceso
  return NextResponse.json({ message: "Sesión cerrada" });
}