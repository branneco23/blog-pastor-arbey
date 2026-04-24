'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Video } from 'lucide-react';

interface LiveConfigModalProps {
  onClose: () => void;
}

export default function LiveConfigModal({ onClose }: LiveConfigModalProps) {
  const [videoId, setVideoId] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoId.trim()) {
      const cleanId = videoId.trim();
      
      try {
        // Guardamos el ID en el servidor a través de la API
        await fetch('/api/live', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cleanId }),
        });

        onClose();
        router.push(`/live/${cleanId}`);
      } catch (error) {
        alert("Error al sincronizar la transmisión");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm text-black">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-red-600">
              <Video size={24} />
              <h2 className="font-black text-xl uppercase tracking-tighter">Configurar Transmisión</h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="ID de YouTube (ej: hohchX9IY6Y)"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-red-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl uppercase tracking-tighter transition-all"
            >
              Publicar En Vivo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}