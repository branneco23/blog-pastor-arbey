'use client';
import { useEffect, useState } from 'react';

export default function LivePage() {
  const [embedUrl, setEmbedUrl] = useState<string>("");

  useEffect(() => {
    // Dentro de useEffect en app/live/page.tsx
    const fetchLive = async () => {
      const res = await fetch('/api/live');
      const data = await res.json();

      // Si está en vivo y tenemos el ID de YouTube
      if (data.isLive && data.youtubeId) {
        setEmbedUrl(`https://www.youtube.com/embed/${data.youtubeId}?autoplay=1&rel=0`);
      } else {
        setEmbedUrl(""); // Limpiar si no hay vivo
      }
    };
    fetchLive();
  }, []);

  return (
    <div className="min-h-screen bg-[#0038a8] flex flex-col items-center py-12">
      <h1 className="text-white text-4xl font-bold mb-8">Transmisiones en Vivo</h1>

      <div className="w-full max-w-5xl px-4">
        <div className="relative aspect-video bg-black rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/10">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white/50 italic">
              No hay una transmisión activa en este momento.
            </div>
          )}
        </div>

        {/* Etiqueta de EN VIVO */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-white font-black uppercase tracking-widest text-xs">En Directo</span>
        </div>
      </div>
    </div>
  );
}