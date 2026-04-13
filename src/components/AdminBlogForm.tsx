'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-2xl border border-slate-200" />
});

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

export default function AdminBlogForm() {
  const router = useRouter();

  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    imageUrl: '',
    readingTime: '',
    videoUrl: ''
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Función auxiliar para obtener el id sin importar si es id o _id
  const getCatId = (cat: Category) => cat.id ?? cat._id ?? '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Error al obtener categorías');
        const data: Category[] = await res.json();
        setDbCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: getCatId(data[0]) }));
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
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
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, content };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si tu API usa cookies de sesión (next-auth, etc.) esto es automático.
          // Si usa Bearer token guardado en localStorage, descomenta:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include', // 👈 Envía cookies de sesión automáticamente (fix del 401)
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('¡Enseñanza publicada con éxito!');
        router.push('/admin/dashboard');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
        alert(`Error: ${errorData.error}`);
        if (res.status === 401) router.push('/login');
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
        type="button"
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] transition-colors group"
      >
        <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
        Volver atrás
      </button>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white rounded-[40px] shadow-sm border border-slate-100">

        {/* Fila: Título y Categoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Título de la Enseñanza</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Ej: La importancia de la oración"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Doctrina / Categoría</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
            >
              {dbCategories.map((cat) => (
                <option key={getCatId(cat)} value={getCatId(cat)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción Corta */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Descripción Corta (Resumen)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Un resumen breve para la tarjeta principal..."
          />
        </div>

        {/* Fila: Imagen y Tiempo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">URL de la Imagen (Portada)</label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tiempo de Lectura</label>
            <input
              name="readingTime"
              value={formData.readingTime}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: 5 min"
            />
          </div>
        </div>

        {/* Video Opcional */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Link de YouTube (Opcional)</label>
          <input
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        {/* Editor de Texto Enriquecido */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cuerpo Completo de la Enseñanza</label>
          <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="Escribe aquí toda la palabra..."
            />
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading || dbCategories.length === 0}
          className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] transition-all ${
            loading
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
          }`}
        >
          {loading ? 'Subiendo enseñanza...' : 'Publicar ahora'}
        </button>
      </form>
    </div>
  );
}