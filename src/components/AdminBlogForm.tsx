'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-[32px] border border-slate-200" />
});

interface Category {
  _id: string; 
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

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Error al obtener categorías');
        const data: Category[] = await res.json();
        setDbCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: data[0]._id }));
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
    if (!content.trim() || content === '<p><br></p>') {
      alert("Por favor, escribe el contenido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, content }),
      });

      if (res.ok) {
        alert('¡Enseñanza publicada!');
        router.push('/admin/dashboard');
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button type="button" onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em]">
        <span>←</span> Volver al Panel
      </button>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Nueva Enseñanza</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase">Título</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase">Categoría</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none appearance-none">
              {dbCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase">Descripción</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none resize-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL Imagen" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none" />
          <input name="readingTime" value={formData.readingTime} onChange={handleChange} placeholder="Tiempo (ej: 5 min)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none" />
        </div>

        <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] bg-blue-600 text-white shadow-xl">
          {loading ? 'Subiendo...' : 'Publicar ahora'}
        </button>
      </form>
    </div>
  );
}