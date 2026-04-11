'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, Edit, Trash2, Plus, ArrowLeft, 
  Tag, X, LayoutDashboard, Loader2 
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const router = useRouter();
  // ✅ Inicializamos siempre como array vacío para evitar errores de .map
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [blogsRes, catsRes] = await Promise.all([
        fetch('/api/blogs'),
        fetch('/api/categories')
      ]);
      
      const blogsData = await blogsRes.json();
      const catsData = await catsRes.json();
      
      // ✅ Validamos que la data sea un array antes de guardar
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setCategories(Array.isArray(catsData) ? catsData : []);
      
      if (!Array.isArray(blogsData)) {
        console.error("La API no devolvió una lista de blogs:", blogsData);
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() }),
      });

      if (res.ok) {
        setNewCatName("");
        setIsModalOpen(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || "Error al guardar");
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta doctrina?')) return;
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // ✅ Ajustado para usar .id (Prisma)
        setBlogs(blogs.filter((b: any) => (b.id || b._id) !== id));
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] transition-all group"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Volver al Inicio
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Tag size={16} className="text-blue-600" />
            Gestionar Doctrinas
          </button>
        </div>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              <LayoutDashboard className="text-blue-600" size={32} />
              Panel de Gestión
            </h1>
            <p className="text-slate-500 text-sm">Administración global del contenido</p>
          </div>
          <Link href="/admin/crear-blog" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <Plus size={20} /> Nueva Doctrina
          </Link>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-72 bg-white rounded-[32px]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ✅ Agregamos validación Array.isArray y usamos blog.id o blog._id */}
            {Array.isArray(blogs) && blogs.length > 0 ? (
              blogs.map((blog: any) => {
                const blogId = blog.id || blog._id;
                return (
                  <div key={blogId} className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4">
                      {/* ✅ Ajustado a blog.imageUrl (Prisma) */}
                      <img 
                        src={blog.imageUrl || blog.image || '/placeholder-image.jpg'} 
                        className="w-full h-full object-cover" 
                        alt={blog.title} 
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-800 border border-white">
                        {blog.category?.name || blog.category || 'Sin categoría'}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-1">{blog.title}</h3>
                    <p className="text-slate-500 text-xs mb-6 line-clamp-2 leading-relaxed">{blog.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex gap-2">
                        <Link href={`/blog/${blogId}`} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <Eye size={18} />
                        </Link>
                        <Link href={`/admin/editar-blog/${blogId}`} className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
                          <Edit size={18} />
                        </Link>
                      </div>
                      <button 
                        onClick={() => deleteBlog(blogId)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No se encontraron doctrinas publicadas.</p>
              </div>
            )}
          </div>
        )}

        {/* POP-UP (MODAL) DE CATEGORÍAS */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            
            <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase">Doctrinas</h2>
                  <p className="text-slate-500 text-xs">Gestiona las categorías del filtro</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="mb-8">
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nombre de la doctrina..."
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <button 
                    disabled={isSubmitting}
                    className="bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-xs uppercase hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    Añadir
                  </button>
                </div>
              </form>

              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 block">Actualmente ocupadas:</span>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {Array.isArray(categories) && categories.map((cat: any) => (
                    <div key={cat.id || cat._id} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}