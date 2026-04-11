'use client';
import { useState, useEffect } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';

export default function CategoryFilter({ activeCategory, onCategoryChange }: any) {
  const [categories, setCategories] = useState<string[]>(["Todas"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ESTADO PARA EL USUARIO
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 1. Verificar si el usuario es Admin al cargar el componente
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === 'admin') {
        setIsAdmin(true);
      }
    }

    // 2. Cargar categorías de la BD
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(["Todas", ...data.map((c: any) => c.name)]);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-role': 'admin' 
        },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      if (res.ok) {
        setNewCategory("");
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 py-8 bg-white px-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
            activeCategory === cat 
              ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
              : "bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-white"
          }`}
        >
          {cat}
        </button>
      ))}

      {/* SEGURIDAD: Solo renderiza el botón si isAdmin es true */}
      {isAdmin && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-all shadow-lg active:scale-90 flex items-center justify-center"
          title="Agregar nueva doctrina"
        >
          <Plus size={18} />
        </button>
      )}

      {/* POP-UP (Solo se activa si isAdmin lo abre) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-black text-slate-900 uppercase mb-4">Nueva Doctrina</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <input 
                autoFocus
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ej: Escatología..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-xs uppercase hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Guardar Categoría"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}