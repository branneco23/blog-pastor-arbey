'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Type, AlignLeft, Tag, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FormularioCrearBlog() {
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
        // Si todo sale bien, volvemos al listado de "Mis Doctrinas"
        router.push('/admin/blogs');
        router.refresh(); 
      } else {
        const errorData = await res.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        
        {/* CABECERA */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/blogs" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition">
            <ArrowLeft size={20} /> Volver al listado
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 uppercase">Nueva Enseñanza</h1>
            <p className="text-xs text-blue-600 font-bold tracking-widest">PASTOR ARBEY BUSTAMANTE</p>
          </div>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          
          {/* Título */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <Type size={14} /> Título de la Doctrina
            </label>
            <input
              type="text"
              required
              placeholder="Ej: El poder de la santidad"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800 placeholder:text-slate-300 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categoría */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <Tag size={14} /> Categoría
              </label>
              <select 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-600 appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Doctrina">Doctrina</option>
                <option value="Reflexión">Reflexión</option>
                <option value="Estudio Bíblico">Estudio Bíblico</option>
              </select>
            </div>

            {/* Tiempo */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <Clock size={14} /> Tiempo Estimado
              </label>
              <input
                type="text"
                placeholder="Ej: 8 min"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-800"
                value={formData.readingTime}
                onChange={(e) => setFormData({...formData, readingTime: e.target.value})}
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <ImageIcon size={14} /> URL de la Imagen Portada
            </label>
            <input
              type="url"
              required
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <AlignLeft size={14} /> Resumen corto
            </label>
            <textarea
              required
              rows={3}
              placeholder="Escribe una breve introducción..."
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? (
              "PUBLICANDO..."
            ) : (
              <>
                <Save size={20} /> GUARDAR ENSEÑANZA
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}