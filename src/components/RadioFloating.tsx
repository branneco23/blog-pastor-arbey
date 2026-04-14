'use client';

import { useState, useEffect } from 'react';
import { Radio, Play, Pause, Minus } from 'lucide-react';
// 1. IMPORTACIÓN DINÁMICA: Esto soluciona el error de tipos y mejora el SSR
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player').then(mod => mod.default), { ssr: false });

export default function RadioFloating() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const YOUTUBE_LIVE_URL = 'https://www.youtube.com/watch?v=Ye0AY30-ml4'; 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* REPRODUCTOR OCULTO */}
      <div 
        style={{ 
          position: 'absolute', 
          opacity: 0, 
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
          overflow: 'hidden' 
        }}
      >
        {/* Usamos el componente cargado dinámicamente y forzamos el tipo a any para el build */}
        <ReactPlayer
          {...({
            url: YOUTUBE_LIVE_URL,
            playing: isPlaying,
            volume: 1,
            muted: false,
            width: "100%",
            height: "100%",
            config: {
              youtube: {
                playerVars: { 
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0
                }
              }
            },
            onPlay: () => console.log("Radio iniciada"),
            onError: (e: any) => console.error("Error en radio:", e)
          } as any)}
        />
      </div>

      {isMinimized ? (
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform border-2 border-white/20"
        >
          <Radio size={24} className={isPlaying ? "animate-pulse" : ""} />
        </button>
      ) : (
        <div className="w-80 bg-[#0b224d] text-white rounded-[32px] shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white/5 px-5 py-3 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Radio IPUC • YouTube Live</span>
            </div>
            <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-white/10 rounded-lg">
              <Minus size={18} />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="flex items-center gap-4 mb-6 text-left">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-blue-400/20">
                <Radio size={28} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight italic">"Un Señor, una fe, un bautismo"</h4>
                <p className="text-[11px] text-blue-200/50 mt-1 uppercase font-bold">Transmisión oficial</p>
              </div>
            </div>

            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-full py-4 rounded-[20px] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                isPlaying ? "bg-red-600 hover:bg-red-700 shadow-red-900/40" : "bg-blue-600 hover:bg-blue-500 shadow-blue-900/40"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={20} fill="currentColor" />
                  <span>DETENER</span>
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  <span>ESCUCHAR AHORA</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}