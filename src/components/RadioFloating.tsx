'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Minus, ExternalLink } from 'lucide-react';

const STREAM_URL = 'https://play14.tikast.com:22038/stream';

export default function RadioPrincipal() {
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    audio.addEventListener('playing', () => {
      setIsPlaying(true);
      setIsLoading(false);
    });
    audio.addEventListener('waiting', () => setIsLoading(true));
    audio.addEventListener('error', () => {
      setIsPlaying(false);
      setIsLoading(false);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.src = '';
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audio.src = `${STREAM_URL}?nocache=${Date.now()}`;
      audio.play().catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    }
  };

  const handleClose = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    setIsPlaying(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-80 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-[#002855] rounded-[28px] shadow-2xl overflow-hidden border border-white/10 ring-1 ring-black/10">

        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl overflow-hidden flex items-center justify-center">
              <img src="/logo-ipuc.webp" alt="Logo IPUC" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <h3 className="text-white text-[11px] font-black uppercase tracking-widest">Radio IPUC</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full transition-colors ${
                  isPlaying
                    ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]'
                    : isLoading
                    ? 'bg-yellow-400 animate-pulse'
                    : 'bg-slate-500'
                }`} />
                <span className="text-[9px] text-white/50 font-bold uppercase tracking-tighter">
                  {isLoading ? 'Conectando...' : isPlaying ? 'En Directo' : 'Desconectado'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/30 hover:text-white transition-all hover:rotate-90 duration-200"
          >
            <Minus size={20} />
          </button>
        </div>

        {/* Visualizador animado */}
        {isPlaying && (
          <div className="px-5 pb-2 flex items-end gap-[3px] h-8">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-[#E5A01A] rounded-full opacity-80"
                style={{
                  height: `${30 + ((i * 37 + 13) % 70)}%`,
                  animation: `pulse ${0.5 + (i % 4) * 0.2}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Controles */}
        <div className="bg-white p-5 space-y-3">
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">
              Transmisión en vivo
            </p>
            <p className="text-slate-700 text-xs font-bold leading-tight uppercase">
              Programación Especial IPUC
            </p>
          </div>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className={`w-full font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-md active:scale-95 ${
              isLoading
                ? 'bg-slate-100 text-slate-400 cursor-wait'
                : isPlaying
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-[#E5A01A] text-white hover:bg-[#D49010]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full" />
                Conectando...
              </>
            ) : isPlaying ? (
              <>
                <Pause size={16} fill="currentColor" /> Detener
              </>
            ) : (
              <>
                <Play size={16} fill="currentColor" /> Escuchar Radio
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
