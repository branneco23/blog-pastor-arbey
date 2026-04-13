'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  // 1. DEFINICIÓN DE ESTADOS (Dentro del componente)
  // Agregamos <any[]> para evitar el error de 'never[]' que aparecía en tu consola
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. FUNCIÓN FETCHDATA (Debe estar dentro de AdminDashboard)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsRes, catsRes] = await Promise.all([
        fetch('/api/blogs', { cache: 'no-store' }),
        fetch('/api/admin/categories', { cache: 'no-store' })
      ]);

      if (!blogsRes.ok || !catsRes.ok) throw new Error('Error en la respuesta');

      const blogsData = await blogsRes.json();
      const catsData = await catsRes.json();

      // Ahora setBlogs y setCategories son accesibles aquí
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta enseñanza?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="p-10 text-center font-bold">Cargando...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      <div className="grid gap-4">
        {blogs.map((blog) => (
          <div key={blog._id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
            <div>
              <h3 className="font-bold">{blog.title}</h3>
              <p className="text-sm text-slate-400 uppercase font-black text-[10px]">
                {/* Usamos el nombre de la categoría poblada */}
                Categoría: {blog.categoryId?.name || 'homilectica'} 
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/admin/editar-blog/${blog._id}`)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(blog._id)}
                className="p-2 bg-red-50 text-red-500 rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}