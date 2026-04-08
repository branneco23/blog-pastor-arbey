'use client';
import { useEffect, useState } from 'react';
import { Edit3, Trash2, Plus, Calendar, Clock, Video } from 'lucide-react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  readingTime: string;
  createdAt: string;
  videoUrl?: string;
}

export default function GestionDoctrinas() {
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      // Aquí ya no marcará error porque definimos <Post[]>
      setBlogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error cargando blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarBlogs(); }, []);

  const eliminarBlog = async (id: string) => {
    if (!confirm("¿Deseas eliminar esta enseñanza de la base de datos?")) return;
    const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBlogs(blogs.filter((b) => b._id !== id));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      {/* Encabezado estilo Figma */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Todas las Doctrinas</h1>
          <p className="text-slate-500 font-medium">{blogs.length} doctrinas publicadas</p>
        </div>
        <Link href="/admin/blogs/nuevo" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
          <Plus size={20} /> Nueva Doctrina
        </Link>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Imagen con Badge de Categoría */}
            <div className="relative h-48 w-full">
              <img src={blog.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {blog.category}
              </div>
              {blog.videoUrl && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-blue-600">
                  <Video size={14} />
                </div>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                {blog.description}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-slate-400 text-[11px] font-semibold uppercase mb-6">
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(blog.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="flex items-center gap-1"><Clock size={14}/> {blog.readingTime}</span>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2 pt-4 border-t border-slate-50">
                <Link href={`/admin/blogs/editar/${blog._id}`} className="flex-1 bg-slate-50 text-slate-600 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center gap-2">
                  <Edit3 size={14} /> Editar
                </Link>
                <button onClick={() => eliminarBlog(blog._id)} className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition flex items-center justify-center gap-2">
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}