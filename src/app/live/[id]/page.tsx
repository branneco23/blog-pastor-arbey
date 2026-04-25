'use client';

import { use, useState, useEffect } from 'react';
import { Lock, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: videoId } = use(params);
  const [loadStream, setLoadStream] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Verificamos si el usuario está logueado
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!mounted) return null;

  // SI NO ESTÁ LOGUEADO: Bloqueamos el acceso
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="text-slate-400" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Acceso Restringido</h2>
        <p className="text-slate-500 mt-2 max-w-sm font-medium">
          Debes iniciar sesión para participar en la transmisión, usar el chat y reaccionar.
        </p>
        <Link href="/" className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
          Volver al Inicio para Ingresar
        </Link>
      </div>
    );
  }

  // SI ESTÁ LOGUEADO: Mostramos el contenido
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            Servicio en Directo
          </h1>
          <div className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase">
             {user?.name ? `Conectado como: ${user.name}` : "Invitado"}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VIDEO */}
          <div className="lg:col-span-2 bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video relative">
            {!loadStream ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center">
                <button 
                  onClick={() => setLoadStream(true)}
                  className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black uppercase hover:scale-105 transition-all shadow-2xl"
                >
                  Ver Transmisión
                </button>
              </div>
            ) : (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* CHAT Y REACCIONES */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col h-[500px] lg:h-auto">
            <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
              <MessageCircle size={16} className="text-blue-600" />
              <span className="text-xs font-black uppercase text-slate-600">Chat en Vivo</span>
            </div>
            
            {loadStream ? (
              <iframe
                className="w-full flex-grow"
                src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`}
                frameBorder="0"
              ></iframe>
            ) : (
              <div className="flex-grow flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase">
                Inicia el video para activar el chat
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}