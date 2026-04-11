'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Radio,
  LogIn,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  Tags
} from 'lucide-react';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const checkUser = () => {
      const saved = localStorage.getItem('user_data');
      if (saved) {
        try {
          const userData = JSON.parse(saved);
          setUser(userData);
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('user-login', checkUser);
    window.addEventListener('storage', checkUser);

    return () => {
      window.removeEventListener('user-login', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  if (!mounted) {
    return <nav className="sticky top-0 z-50 bg-white border-b h-20" />;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden shrink-0">
              <img src="/logo-ipuc.webp" alt="IPUC" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg md:text-xl text-slate-900 leading-none tracking-tight">
                Pastor Arbey Bustamante
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Iglesia Pentecostal Unida de Colombia
              </span>
            </div>
          </Link>

          {/* MENÚ DERECHO */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-bold transition ${pathname === '/' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Inicio
              </Link>

              {/* CORREGIDO: /about en minúsculas */}
              <Link
                href="/about"
                className={`px-4 py-2 text-sm font-bold transition ${pathname === '/about' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Acerca
              </Link>
            </div>

            {/* BOTÓN EN VIVO */}
            <Link href="/en-vivo" className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg shadow-red-100 hover:bg-red-700 transition active:scale-95">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Radio size={16} strokeWidth={3} />
              <span className="hidden sm:inline uppercase tracking-widest text-[11px]">En Vivo</span>
            </Link>

            {/* SECCIÓN DINÁMICA */}
            {user ? (
              <div className="flex items-center gap-4 ml-2">
                <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4 mr-2">

                  <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${pathname === '/admin/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <LayoutDashboard size={16} /> <span className="hidden lg:inline">Mis Doctrinas</span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      href="/admin/categorias"
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${pathname === '/admin/categorias' ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      <Tags size={16} /> <span className="hidden lg:inline">Categorías</span>
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      href="/admin/crear-blog"
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-black shadow-lg active:scale-95 ${pathname === '/admin/crear-blog'
                        ? 'bg-slate-900 text-white shadow-slate-200'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-200 hover:from-blue-700 hover:to-indigo-700'
                        }`}
                    >
                      <PlusCircle size={18} />
                      <span className="hidden lg:inline uppercase tracking-tight">Crear Blog</span>
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full pr-4 border border-slate-200 shadow-sm">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold uppercase text-xs">
                    {user?.name ? user.name.charAt(0) : 'A'}
                  </div>

                  <div className="hidden sm:flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900 leading-none">
                      {user?.name || 'Usuario'}
                    </span>
                    <span className="text-[9px] text-blue-600 font-black uppercase tracking-tighter mt-0.5">
                      {user?.role || 'Invitado'}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="ml-1 p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-100 hover:bg-blue-700 transition active:scale-95 flex items-center gap-2"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}