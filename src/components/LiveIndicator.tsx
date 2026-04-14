'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Swal from 'sweetalert2';
import {
  MessageCircle, Heart, ThumbsUp, Flame, Star, Share2, Users
} from 'lucide-react';

// 1. Define la interfaz de lo que necesita el reproductor
interface PlayerProps {
  url: string;
  width?: string | number;
  height?: string | number;
  playing?: boolean;
  controls?: boolean;
  muted?: boolean;
}

// 2. Aplica el tipo al componente dinámico
const ReactPlayer = dynamic<PlayerProps>(
  () => import('react-player').then((mod) => mod.default),
  { ssr: false }
);

export default function LiveStreamSection() {
  const [mounted, setMounted] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isDomReady, setIsDomReady] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleAuthAndLive = async () => {
      const savedUser = localStorage.getItem('user_data');
      const user = savedUser ? JSON.parse(savedUser) : null;

      if (user?.role === 'admin') {
        const { value: url } = await Swal.fire({
          title: 'Configurar Transmisión',
          text: 'Pega el enlace de YouTube para activar la señal.',
          input: 'text',
          inputPlaceholder: 'https://www.youtube.com/watch?v=...',
          confirmButtonText: 'Cargar En Vivo',
          confirmButtonColor: '#2563eb',
          allowOutsideClick: false,
          customClass: { popup: 'rounded-[32px]' }
        });

        setVideoUrl(url || 'https://www.youtube.com/watch?v=Ye0AY30-ml4');
      } else {
        setVideoUrl('https://www.youtube.com/watch?v=Ye0AY30-ml4');
      }

      // Evita el AbortError esperando la estabilidad del DOM
      setTimeout(() => setIsDomReady(true), 1500);
    };

    handleAuthAndLive();
  }, []);

  if (!mounted) return null;

  return (
    <section className="bg-blue-600 py-12 md:py-20 px-4 md:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tighter">Transmisiones en Vivo</h2>
        <p className="text-blue-100 opacity-90">Únete a nuestras predicaciones en tiempo real</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 bg-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="lg:col-span-2 flex flex-col border-r border-slate-100">
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {isDomReady && videoUrl ? (
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                muted={false}
              />
            ) : (
              <div className="text-blue-400 font-bold animate-pulse text-sm">Sincronizando señal...</div>
            )}
          </div>

          <div className="p-8 md:p-10">
            <div className="flex flex-col gap-4">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full w-fit">En Directo</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900">EN VIVO: Transmisión Actual</h3>
              <p className="text-slate-500 italic font-medium">Pastor Arbey Bustamante — IPUC Neiva</p>

              <div className="flex gap-3 mt-4 overflow-x-auto pb-4 no-scrollbar">
                {[
                  { icon: <ThumbsUp size={18} />, label: 'Me gusta', color: 'bg-yellow-50 text-yellow-600' },
                  { icon: <Heart size={18} />, label: 'Me encanta', color: 'bg-pink-50 text-pink-600' },
                  { icon: <Star size={18} />, label: 'Aleluya', color: 'bg-purple-50 text-purple-600' },
                  { icon: <Flame size={18} />, label: 'Amén', color: 'bg-orange-50 text-orange-600' },
                ].map((btn, i) => (
                  <button key={i} className={`${btn.color} flex flex-col items-center gap-1.5 px-6 py-3 rounded-2xl shadow-sm shrink-0 hover:scale-105 transition-all border border-current/10`}>
                    {btn.icon}
                    <span className="text-[10px] font-black uppercase tracking-tighter">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0b1b3d] flex flex-col h-[400px] lg:h-auto">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-white">Chat en vivo</span>
            </div>
            <Share2 size={16} className="text-blue-400" />
          </div>
          <div className="flex-grow flex items-center justify-center opacity-30 italic text-blue-100 text-sm">
            Conectando con la congregación...
          </div>
          <div className="p-6 bg-white/5 border-t border-white/5">
            <input type="text" placeholder="Escribe tus bendiciones..." className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none" />
          </div>
        </div>
      </div>
    </section>
  );
}