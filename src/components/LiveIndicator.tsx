'use client';
import { useState } from 'react';
import { X, Loader2, Play, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  onClose: () => void;
}

// Icono de YouTube manual para evitar errores de Lucide
const YoutubeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export default function LiveConfigModal({ onClose }: Props) {
  const router = useRouter();
  const [youtubeId, setYoutubeId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveAndRedirect = async () => {
    if (!youtubeId) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/admin/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isLive: true,
          youtubeId: youtubeId,
          title: "Transmisión en Vivo - IPUC Neiva"
        }),
      });

      if (res.ok) {
        onClose();
        router.push('/live');
        router.refresh();
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-50 rounded-[30px] flex items-center justify-center text-red-600 mb-6">
            <YoutubeIcon />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Panel de Señal</h2>
          <p className="text-slate-500 text-sm mb-8">Ingresa el ID del video para habilitar la transmisión.</p>

          <div className="w-full space-y-6">
            <div className="text-left">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">ID de YouTube</label>
              <input 
                type="text" 
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="Ej: dQw4w9WgXcQ"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-mono focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
              <p className="mt-3 flex items-center gap-2 text-[10px] text-blue-500 font-bold bg-blue-50 py-2 px-3 rounded-lg">
                <Info size={12} /> El ID son los caracteres después de "v="
              </p>
            </div>

            <button 
              onClick={() => handleSaveAndRedirect()} // Función envuelta para corregir el error de tipos
              disabled={loading || !youtubeId}
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <><Play size={18} fill="currentColor" /> Habilitar Señal</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}