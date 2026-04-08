import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt'; 

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Definir rutas que queremos proteger
  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (isAdminPath || isAdminApi) {
    // Si no hay token en las cookies
    if (!token) {
      // Si es una API, respondemos con JSON
      if (isAdminApi) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
      // Si es una página, redirigimos al Home (ya que usas un Modal, no una página /login)
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const payload = await verifyToken(token);

      // Si el token no es válido o NO es admin
      if (!payload || payload.role !== 'admin') {
        if (isAdminApi) {
          return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Todo bien, continúa
      return NextResponse.next();

    } catch (error) {
      // Token corrupto o expirado
      console.error("Middleware Auth Error:", error);
      const response = isAdminApi 
        ? NextResponse.json({ error: 'Sesión expirada' }, { status: 401 })
        : NextResponse.redirect(new URL('/', request.url));
      
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// Configuración del Matcher optimizada
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas de administración y APIs de admin
     */
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};