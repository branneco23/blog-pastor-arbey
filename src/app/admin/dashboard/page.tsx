'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserX, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  // 1. ESTADOS UNIFICADOS
  const [blogs, setBlogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. CARGA DE DATOS CENTRALIZADA
  const fetchData = async () => {
    try {
      setLoading(true);
      const [blogsRes, usersRes] = await Promise.all([
        fetch('/api/blogs', { cache: 'no-store' }),
        fetch('/api/admin/users', { cache: 'no-store' })
      ]);

      if (!blogsRes.ok || !usersRes.ok) throw new Error('Error al obtener datos');

      const blogsData = await blogsRes.json();
      const usersData = await usersRes.json();

      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      // Tomamos solo los últimos 5 usuarios para el resumen del dashboard
      setUsers(Array.isArray(usersData) ? usersData.slice(0, 5) : []);
    } catch (error) {
      console.error("Error en Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 3. ACCIONES
  const handleDeleteBlog = async (id: string) => {
    if (!confirm("¿Eliminar esta enseñanza?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="font-bold text-slate-500">Cargando panel de control...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">

      {/* SECCIÓN 1: PANEL DE BLOGS */}
      <section>
        <h2 className="text-xl font-black uppercase tracking-tight italic mb-6">
          Panel de <span className="text-blue-600">Administración de Blogs</span>
        </h2>
        <div className="grid gap-4">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog._id} className="p-5 bg-white border border-slate-200 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-bold text-slate-800">{blog.title}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-tighter">
                    Categoría: <span className="text-blue-500">{blog.categoryId?.name || 'General'}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/admin/editar-blog/${blog._id}`)}
                    className="px-4 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="px-4 py-2 text-xs font-bold bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center p-10 bg-slate-50 rounded-2xl border border-dashed text-slate-400">
              No se han publicado enseñanzas aún.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}