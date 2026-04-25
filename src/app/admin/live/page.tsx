'use client';
import { useState, useEffect } from 'react';
import { Radio, Play, StopCircle, Loader2 } from 'lucide-react';

export default function AdminLivePage() {
  const [liveData, setLiveData] = useState({ isLive: false, youtubeId: '', title: '' });
  const [loading, setLoading] = useState(true); // Empezamos en true para la carga inicial

  // 1. Cargar los datos actuales al entrar
  useEffect(() => {
    fetch('/api/live') // Consultamos la ruta pública
      .then(res => res.json())
      .then(data => {
        if (data && data.youtubeId !== undefined) {
          setLiveData({
            isLive: data.isLive || false,
            youtubeId: data.youtubeId || '',
            title: data.title || ''
          });
        }
      })
      .catch(err => console.error("Error al cargar datos:", err))
      .finally(() => setLoading(false));
  }, []);

  // 2. Guardar los datos (POST)
  const handleSave = async () => {
    if (liveData.isLive && !liveData.youtubeId) {
      alert("Si activas el vivo, debes poner un ID de YouTube");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/live', { // CAMBIO: Usamos la ruta corregida
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(liveData),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      alert("¡Base de Datos actualizada con éxito!");
    } catch (error) {
      console.error(error);
      alert("Error al guardar. Revisa la conexión con MongoDB.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-slate-900">
        <Radio className={liveData.isLive ? "text-red-500 animate-pulse" : "text-slate-400"} />
        Panel de Control: Transmisión IPUC
      </h1>

      <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm space-y-8">
        {/* Switch de Estado */}
        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Señal en Vivo</h3>
            <p className="text-slate-500 text-sm">
              {liveData.isLive ? 'La transmisión aparecerá en la web' : 'Transmisión oculta'}
            </p>
          </div>
          <button
            onClick={() => setLiveData({ ...liveData, isLive: !liveData.isLive })}
            className={`w-16 h-8 rounded-full transition-all relative ${liveData.isLive ? 'bg-red-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${liveData.isLive ? 'left-9' : 'left-1'}`} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">Título del Servicio</label>
            <input
              type="text"
              placeholder="Ej: Culto Dominical - 10:00 AM"
              value={liveData.title}
              onChange={(e) => setLiveData({ ...liveData, title: e.target.value })}
              className="w-full p-5 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">ID del Video de YouTube</label>
            <input
              type="text"
              placeholder="Ej: QP5dlQn-WBA"
              value={liveData.youtubeId}
              onChange={(e) => setLiveData({ ...liveData, youtubeId: e.target.value })}
              className="w-full p-5 rounded-2xl border border-slate-200 font-mono outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800"
            />
            <p className="text-[10px] text-slate-400 ml-2">Es el código que sale después de v= en el link de YouTube</p>
          </div>
        </div>

        {/* Botón Guardar */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {liveData.isLive ? <StopCircle size={20} /> : <Play size={20} />}
              Actualizar Transmisión
            </>
          )}
        </button>
      </div>
    </div>
  );
}