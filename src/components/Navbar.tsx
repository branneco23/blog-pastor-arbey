'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Radio, LogIn, UserCircle, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem('user_data');
      if (saved) setUser(JSON.parse(saved));
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_data');
    setUser(null);
    window.location.reload();
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
          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
              Inicio
            </Link>

            {/* BOTÓN EN VIVO */}
            <Link href="/en-vivo" className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-black shadow-lg shadow-red-100 hover:bg-red-700 transition active:scale-95">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <Radio size={16} strokeWidth={3} />
              EN VIVO
            </Link>

            <Link href="/acerca" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition">
              Acerca
            </Link>

            {/* SESIÓN */}
            {user && user.name ? (
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-full pr-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold uppercase">
                  {user.name[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                  {user.role === 'admin' && (
                    <Link href="/admin/blogs" className="text-[10px] text-blue-600 font-black uppercase tracking-tighter hover:underline">
                      Panel Admin
                    </Link>
                  )}
                </div>
                {/* Botón de cerrar sesión opcional */}
                <button onClick={handleLogout} className="ml-2 text-slate-400 hover:text-red-500">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              // CAMBIO AQUÍ: De <Link> a <button> con el evento onClick
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition active:scale-95 flex items-center gap-2"
              >
                <LogIn size={16} />
                Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </nav>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}