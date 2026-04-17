'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Radio,
  LogIn,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  Tags,
  MessageSquare
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  if (!mounted) {
    return <nav className="sticky top-0 z-50 bg-white border-b h-20" />;
  }

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm transition-all duration-700">
        <div
          className={`mx-auto px-6 h-20 flex items-center justify-between transition-all duration-500 ease-in-out ${
            isAdmin ? 'max-w-[98%] 2xl:max-w-[1600px]' : 'max-w-7xl'
          }`}
        >

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden">
              <img src="/logo-ipuc.webp" alt="IPUC" className="w-10 h-10 object-contain" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-lg text-slate-900 leading-none tracking-tighter">
                Pastor Arbey Bustamante
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                IPUC Neiva
              </span>
            </div>
          </Link>

          {/* CONTENEDOR DERECHO */}
          <div className="flex items-center justify-end gap-3 flex-1 ml-4">

            {/* Menú Público */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { path: '/', label: 'Inicio' },
                { path: '/about', label: 'Sobre Mí' },
                { path: '/testimonios', label: 'Testimonios' }
              ].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                    pathname === link.path
                      ? 'text-blue-600 bg-blue-50/50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* BOTÓN EN VIVO */}
            <Link
              href="/live"
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-black shadow-lg hover:bg-red-700 transition shrink-0"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-100 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="uppercase tracking-tighter">En Vivo</span>
            </Link>

            {/* SECCIÓN DINÁMICA */}
            {user ? (
              <div className="flex items-center gap-2 pl-4 border-l border-slate-100 animate-in fade-in slide-in-from-right-2">
                <div className="hidden md:flex items-center gap-1">

                  <Link
                    href="/admin/dashboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      pathname === '/admin/dashboard'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden xl:inline">Doctrinas</span>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link
                        href="/admin/testimonios"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          pathname === '/admin/testimonios'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <MessageSquare size={16} />
                        <span className="hidden xl:inline">Testimonios</span>
                      </Link>

                      <Link
                        href="/admin/categorias"
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          pathname === '/admin/categorias'
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Tags size={16} />
                        <span className="hidden xl:inline">Categorías</span>
                      </Link>

                      <Link
                        href="/admin/crear-blog"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black shadow-md hover:bg-blue-700 transition-all shrink-0 ml-1"
                      >
                        <PlusCircle size={16} />
                        <span className="hidden xl:inline uppercase">Nuevo</span>
                      </Link>
                    </>
                  )}
                </div>

                {/* Perfil Mini */}
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-full pr-3 border border-slate-100 shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs uppercase">
                    {/* 👇 FIX: optional chaining para evitar crash si name es undefined */}
                    {user?.name?.charAt(0) ?? '?'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-slate-900 text-white px-5 py-2 rounded-full font-bold text-sm hover:bg-slate-800 transition shrink-0 flex items-center gap-2"
              >
                <LogIn size={16} /> Ingresar
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}