'use client';
import { useState, useEffect } from 'react';
import { Radio, Play, StopCircle } from 'lucide-react';

// 1. Componente Youtube corregido para aceptar props de estilo y tamaño
const YoutubeIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export default function AdminLive() {
  const [liveData, setLiveData] = useState({ isLive: false, youtubeId: '', title: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/live')
      .then(res => res.json())
      .then(data => {
        if (data) setLiveData(data);
      })
      .catch(err => console.error("Error cargando live:", err));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveData),
      });
      alert("Estado de transmisión actualizado");
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-900">
        <Radio className={liveData.isLive ? "text-red-500 animate-pulse" : "text-slate-400"} />
        Centro de Transmisión Dominical
      </h1>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Estado de la señal</h3>
            <p className="text-slate-500 text-sm">Activa esto para mostrar el reproductor en la página principal</p>
          </div>
          <button
            type="button"
            onClick={() => setLiveData({ ...liveData, isLive: !liveData.isLive })}
            className={`w-16 h-8 rounded-full transition-colors relative ${liveData.isLive ? 'bg-red-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${liveData.isLive ? 'left-9' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Título de la Transmisión</label>
            <input
              type="text"
              value={liveData.title}
              placeholder="Ej: Culto de Adoración - Domingo de Gloria"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
              onChange={(e) => setLiveData({ ...liveData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              {/* Uso del componente corregido */}
              <YoutubeIcon size={16} className="text-red-600" /> ID del Video de YouTube
            </label>
            <input
              type="text"
              value={liveData.youtubeId}
              placeholder="Ej: dQw4w9WgXcQ"
              className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-slate-800"
              onChange={(e) => setLiveData({ ...liveData, youtubeId: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : (liveData.isLive ? <><StopCircle size={20} /> Guardar y Mantener Vivo</> : <><Play size={20} /> Guardar Configuración</>)}
        </button>
      </div>

      {liveData.youtubeId && (
        <div className="mt-10">
          <h4 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest text-center">Vista previa para los hermanos</h4>
          <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${liveData.youtubeId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}