'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, PlusCircle, BookOpen, ArrowLeft, Save, Image as ImageIcon, Type, AlignLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default function NuevaDoctrina() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: '',
    category: 'Doctrina',
    readingTime: '5 min'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/blogs');
        router.refresh();
      } else {
        alert("Error al guardar la doctrina");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/admin/blogs" 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition"
          >
            <ArrowLeft size={20} /> Volver
          </Link>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Nueva Doctrina
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
            
            {/* Título */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider">
                <Type size={16} className="text-blue-600" /> Título de la enseñanza
              </label>
              <input
                type="text"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium text-slate-900"
                placeholder="Ej: La importancia de la oración"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Categoría y Tiempo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider">
                  <Tag size={16} className="text-blue-600" /> Categoría
                </label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-bold text-slate-700"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Doctrina">Doctrina</option>
                  <option value="Reflexión">Reflexión</option>
                  <option value="Estudio">Estudio Bíblico</option>
                  <option value="Jóvenes">Jóvenes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider">
                  <Clock size={16} className="text-blue-600" /> Tiempo de lectura
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                  placeholder="Ej: 10 min"
                  value={formData.readingTime}
                  onChange={(e) => setFormData({...formData, readingTime: e.target.value})}
                />
              </div>
            </div>

            {/* URL Imagen */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider">
                <ImageIcon size={16} className="text-blue-600" /> URL de la Imagen
              </label>
              <input
                type="url"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                placeholder="https://images.unsplash.com/..."
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
            </div>

            {/* Descripción Corta */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700 uppercase tracking-wider">
                <AlignLeft size={16} className="text-blue-600" /> Breve resumen
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium resize-none"
                placeholder="Escribe un resumen que invite a leer..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            {/* Botón de Guardar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-slate-300"
            >
              {loading ? "GUARDANDO..." : (
                <>
                  <Save size={20} /> PUBLICAR DOCTRINA
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}