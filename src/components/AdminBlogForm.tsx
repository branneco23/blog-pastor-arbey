'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Importación dinámica para el editor
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-2xl border border-slate-200" /> 
});

export default function AdminBlogForm() {
  const router = useRouter();
  
  // 1. Estados para los datos y categorías de la BD
  const [dbCategories, setDbCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '', // Se llenará con la primera categoría que encuentre la BD
    description: '',
    image: '',
    readingTime: '',
    videoUrl: ''
  });
  const [content, setContent] = useState(''); 
  const [loading, setLoading] = useState(false);

  // 2. Cargar categorías de la base de datos al montar el componente
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setDbCategories(data);
        
        // Si hay categorías, ponemos la primera por defecto en el formData
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0].name }));
        }
      } catch (error) {
        console.error("Error cargando categorías para el formulario:", error);
      }
    };
    fetchCats();
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, content }),
      });

      if (res.ok) {
        alert('¡Enseñanza publicada con éxito!');
        router.push('/');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (err) {
      alert('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] transition-colors group"
      >
        <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
        Volver atrás
      </button>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título del Blog</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ej: La importancia de la fe" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoría</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {dbCategories.length > 0 ? (
                dbCategories.map((cat: any) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option disabled>No hay categorías creadas...</option>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descripción Corta (Resumen para la card)</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Un breve resumen de lo que trata esta enseñanza..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">URL de la Imagen</label>
            <input name="image" value={formData.image} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tiempo de Lectura</label>
            <input name="readingTime" value={formData.readingTime} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: 5 min" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Link de Video (YouTube) - Opcional</label>
          <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://www.youtube.com/watch?v=..." />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cuerpo del Blog</label>
          <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200">
            <ReactQuill 
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Escribe aquí toda la enseñanza..."
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || dbCategories.length === 0}
          className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] transition-all ${
            loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
          }`}
        >
          {loading ? 'Publicando...' : 'Publicar Enseñanza'}
        </button>
      </form>
    </div>
  );
}