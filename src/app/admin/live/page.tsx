'use client';
import { useState, useEffect } from 'react';
import { Radio, Play, StopCircle, Loader2 } from 'lucide-react';

export default function AdminLivePage() {
  const [liveData, setLiveData] = useState({ isLive: false, youtubeId: '', title: '' });
  const [loading, setLoading] = useState(false);
  // Se agrega el estado que faltaba según el error de tu captura
  const [isModalOpen, setIsModalOpen] = useState(false); 

  useEffect(() => {
    fetch('/api/admin/live')
      .then(res => res.json())
      .then(data => {
        if (data) setLiveData(data);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveData),
      });
      alert("Configuración actualizada correctamente");
      setIsModalOpen(false); // Ahora sí funcionará
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

      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm space-y-8">
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Estado de la señal</h3>
            <p className="text-slate-500 text-sm">Controla la visibilidad del reproductor</p>
          </div>
          <button
            onClick={() => setLiveData({ ...liveData, isLive: !liveData.isLive })}
            className={`w-16 h-8 rounded-full transition-all relative ${liveData.isLive ? 'bg-red-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${liveData.isLive ? 'left-9' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Título de la transmisión"
            value={liveData.title}
            onChange={(e) => setLiveData({ ...liveData, title: e.target.value })}
            className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            placeholder="ID del Video (YouTube)"
            value={liveData.youtubeId}
            onChange={(e) => setLiveData({ ...liveData, youtubeId: e.target.value })}
            className="w-full p-5 rounded-2xl border border-slate-200 font-mono outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <button
          onClick={() => handleSave()}
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {liveData.isLive ? <StopCircle size={20} /> : <Play size={20} />}
              Guardar Configuración
            </>
          )}
        </button>
      </div>
    </div>
  );
}