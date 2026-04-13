'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Video, Loader2 } from 'lucide-react'; // Cambiamos Youtube por Video

export default function AdminTestimonios() {
  const [youtubeInput, setYoutubeInput] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const cleanYoutubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : url;
    return id.trim();
  };

  const handleSave = async () => {
    if (!title || !youtubeInput) {
      alert("Por favor completa todos los campos");
      return;
    }

    const id = cleanYoutubeId(youtubeInput);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, youtubeId: id }),
      });

      if (res.ok) {
        alert("¡Testimonio publicado con éxito!");
        setTitle('');
        setYoutubeInput('');
        router.refresh(); 
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'No se pudo guardar'}`);
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* BOTÓN RETROCEDER */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Volver</span>
        </button>

        <div className="bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              {/* Usamos el icono Video en lugar de Youtube */}
              <Video size={24} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">
              Publicar Nuevo Testimonio
            </h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">
                Título del Testimonio
              </label>
              <input 
                value={title}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-300 transition-all"
                placeholder="Ej: Transformación y fe..."
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">
                ID o Link de YouTube
              </label>
              <input 
                value={youtubeInput}
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-300 transition-all"
                placeholder="Pegar link o ID aquí..."
                onChange={(e) => setYoutubeInput(e.target.value)}
              />
            </div>

            <button 
              onClick={handleSave}
              disabled={isSubmitting}
              className={`w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:-translate-y-1'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar Ahora'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}