'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Radio, LogIn, LogOut, PlusCircle, BookOpen, LayoutDashboard } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem('user_data');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          console.error("Error al parsear user_data", e);
        }
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO E IGLESIA */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 overflow-hidden shrink-0">
              <img src="/logo-ipuc.webp" alt="IPUC" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 leading-none tracking-tight">
                Pastor Arbey Bustamante
              </span>
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                Iglesia Pentecostal Unida de Colombia
              </span>
            </div>
          </Link>

          {/* MENÚ DERECHO */}
          <div className="flex items-center gap-4">
            {/* ENLACES PÚBLICOS (Solo se ven si no hay usuario o en pantallas grandes) */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <Link href="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
                Inicio
              </Link>
              <Link href="/acerca" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
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
              <span className="hidden sm:inline">EN VIVO</span>
            </Link>

            {/* SECCIÓN DINÁMICA DE SESIÓN / DASHBOARD */}
            {user && user.name ? (
              <div className="flex items-center gap-4 ml-2">

                {/* ACCESOS DE ADMINISTRADOR (Desktop) */}
                <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-4 mr-2">
                  <Link
                    href="/admin/blogs"
                    className={`flex items-center gap-2 p-2 rounded-lg transition ${pathname === '/admin/blogs' ? 'text-blue-600 bg-blue-50' : 'text-slate-500'
                      }`}
                  >
                    <BookOpen size={16} /> Mis Doctrinas
                  </Link>
                  <Link
                    href="/admin/blogs/nuevo"
                    className="flex items-center gap-2 text-[11px] font-black uppercase bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition tracking-wider"
                  >
                    <PlusCircle size={16} /> Crear Blog
                  </Link>
                </div>

                {/* PERFIL Y LOGOUT */}
                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full pr-4 border border-slate-200">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold uppercase text-sm">
                    {user.name[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                    <span className="text-[9px] text-blue-600 font-black uppercase tracking-tighter mt-0.5">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-1 text-slate-400 hover:text-red-500 transition"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* BOTÓN INICIAR SESIÓN (MODAL) */
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md shadow-blue-100 hover:bg-blue-700 transition active:scale-95 flex items-center gap-2"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Ingresar</span>
                <span className="sm:hidden text-xs uppercase">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* COMPONENTE MODAL */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}