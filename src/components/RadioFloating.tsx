'use client';
import { useState, useRef } from 'react';
import { Play, Pause, Minus, ExternalLink } from 'lucide-react';

export default function RadioPrincipal() {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      setIsPlaying(false);
    } else {
      const popup = window.open(
        'https://www.youtube.com/@RadioIPUC/live',
        'RadioIPUC',
        'width=400,height=300,top=100,left=100'
      );
      popupRef.current = popup;
      setIsPlaying(true);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-[#002855] rounded-[35px] shadow-2xl overflow-hidden border border-white/10 ring-1 ring-black/10">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <img src="/logo-ipuc.webp" alt="Logo IPUC" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <h3 className="text-white text-[11px] font-black uppercase tracking-widest">
                Radio IPUC
              </h3>
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${isPlaying
                      ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]'
                      : 'bg-slate-500'
                    }`}
                />
                <span className="text-[9px] text-white/50 font-bold uppercase tracking-tighter">
                  {isPlaying ? 'En Directo' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
              }
              setIsPlaying(false);
              setIsVisible(false);
            }}
            className="text-white/20 hover:text-white transition-all hover:rotate-90"
          >
            <Minus size={24} />
          </button>
        </div>
        <div className="bg-white p-6 space-y-4">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              Transmisión en vivo
            </p>
            <p className="text-slate-700 text-xs font-bold leading-tight uppercase">
              Programación Especial IPUC
            </p>
          </div>
          <button
            onClick={togglePlay}
            className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest shadow-lg ${isPlaying
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-[#E5A01A] text-white hover:bg-[#D49010] shadow-yellow-600/20 active:scale-95'
              }`}
          >
            {isPlaying ? (
              <>
                <Pause size={18} fill="currentColor" />
                Detener
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Escuchar Radio
              </>
            )}
          </button>
          <a
            href="https://www.youtube.com/@RadioIPUC/live"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
          >
            <ExternalLink size={12} />
            Ver en YouTube
          </a>
        </div>
      </div>
    </div>
  );
}