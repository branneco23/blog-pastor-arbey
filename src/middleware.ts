import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt'; // Asegúrate de que lib/jwt use 'jose'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Proteger rutas de Administración (/admin y subrutas)
  if (pathname.startsWith('/admin')) {
    
    // Si no hay token, enviamos al login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const payload = await verifyToken(token);

      // Si el token no es válido o el usuario NO es administrador
      if (!payload || payload.role !== 'admin') {
        // Redirigir al home si es un usuario normal intentando entrar al panel
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Si es admin y el token es válido, permitimos el paso
      return NextResponse.next();

    } catch (error) {
      // Si el token expiró o es corrupto, borramos la cookie y al login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // 2. Ejemplo: Proteger APIs sensibles (Opcional pero recomendado)
  // Si tienes rutas de API que solo el admin puede tocar
  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

// Configuración del Matcher: Define dónde se activa el middleware
export const config = {
  matcher: [
    /*
     * Excluimos explícitamente las rutas de auth para evitar 404 o bloqueos
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*',
    '/api/admin/:path*'
  ],
};