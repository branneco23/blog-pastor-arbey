'use client';

import { useState, useEffect } from 'react';
import { PlayCircle, Quote, Video, Loader2 } from 'lucide-react';

interface Testimonio {
  _id: string;
  title: string;
  youtubeId: string;
  descripcion?: string;
}

export default function TestimoniosPage() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Efecto inicial para hidratación y carga de datos
  useEffect(() => {
    setMounted(true);
    
    const fetchTestimonios = async () => {
      try {
        const res = await fetch('/api/testimonios');
        if (!res.ok) throw new Error("Error en la API");
        const data = await res.json();
        setTestimonios(data);
      } catch (error) {
        console.error("Error cargando testimonios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonios();
  }, []);

  /**
   * Procesa la entrada para generar un link de embed válido.
   * Soporta IDs directos, links de "Live" y links normales.
   */
  const getEmbedUrl = (input: string) => {
    if (!input) return '';
    let videoId = input.trim();

    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      try {
        const url = new URL(input.includes('http') ? input : `https://${input}`);
        if (input.includes('live/')) {
          videoId = url.pathname.split('/live/')[1];
        } else if (input.includes('youtu.be/')) {
          videoId = url.pathname.slice(1);
        } else if (url.searchParams.has('v')) {
          videoId = url.searchParams.get('v') || '';
        }
      } catch (e) {
        console.error("Error parseando URL de YouTube:", e);
      }
    }

    const cleanId = videoId.split(/&|\?/)[0];
    return `https://www.youtube.com/embed/${cleanId}?rel=0&modestbranding=1`;
  };

  // Bloqueo de hidratación para evitar errores de "removeChild" o mismatch del DOM
  if (!mounted) return null;

  // Estado de carga inicial
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Cargando testimonios...</p>
        </div>
      </div>
    );
  }

  // Estado si la base de datos está vacía
  if (testimonios.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Video className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
            No hay testimonios publicados actualmente
          </p>
        </div>
      </div>
    );
  }

  const destacado = testimonios[0];
  const anteriores = testimonios.slice(1);

  return (
    <div className="bg-white min-h-screen">
      {/* SECCIÓN HERO - TESTIMONIO PRINCIPAL */}
      <section className="relative bg-slate-900 min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute inset-0 opacity-20 blur-[120px] scale-110 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600 rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6 py-12 text-center">
          <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8 inline-block shadow-xl shadow-blue-900/30">
            Último Testimonio
          </span>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-12 tracking-tighter leading-none max-w-4xl mx-auto">
            {destacado.title}
          </h1>

          <div className="aspect-video rounded-[30px] md:rounded-[50px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-[8px] border-white/5 bg-black">
            <iframe
              src={getEmbedUrl(destacado.youtubeId)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* GALERÍA DE ANTERIORES */}
      {anteriores.length > 0 && (
        <section className="max-w-7xl mx-auto py-24 px-6">
          <div className="flex items-center justify-between mb-16">
            <div className="h-[1px] bg-slate-100 flex-1" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 px-8">
              Galería de Victorias
            </h2>
            <div className="h-[1px] bg-slate-100 flex-1" />
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {anteriores.map((t) => (
              <div key={t._id} className="break-inside-avoid group">
                <div className="bg-slate-50 rounded-[35px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100 hover:-translate-y-2">
                  <div className="aspect-video relative overflow-hidden bg-slate-200">
                    <iframe
                      src={getEmbedUrl(t.youtubeId)}
                      className="w-full h-full border-none"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors">
                      {t.title}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}