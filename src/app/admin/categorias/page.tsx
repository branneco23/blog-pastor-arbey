'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  BookOpen,
  Loader2
} from 'lucide-react';

export default function GestionCategorias() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Cargar categorías con su respectivo conteo de blogs
  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setNewName('');
        fetchCats();
      }
    } catch (error) {
      alert("Error al crear categoría");
    }
  };

  const handleDelete = async (id: string, count: number) => {
    if (count > 0) {
      alert(`No puedes eliminar esta categoría porque tiene ${count} enseñanzas asociadas. Mueve las enseñanzas a otra categoría primero.`);
      return;
    }

    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
        if (res.ok) fetchCats();
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchCats();
      }
    } catch (error) {
      alert("Error al actualizar");
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Cargando biblioteca de temas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto min-h-screen">

      {/* BOTÓN VOLVER */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] transition-colors group"
      >
        <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
        Volver atrás
      </button>

      <div className="flex flex-col mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Biblioteca de Temas</h1>
        <p className="text-slate-500 text-lg">Organiza y cuantifica las enseñanzas del Pastor Arbey.</p>
      </div>

      {/* INPUT PARA CREAR NUEVA CATEGORÍA */}
      <div className="flex gap-2 mb-12 bg-white p-2 rounded-2xl shadow-md shadow-slate-100 border border-slate-100">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Ej: Escatología, Familia, Santidad..."
          className="flex-1 p-3 outline-none bg-transparent text-slate-700 font-medium"
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-bold transition shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Agregar</span>
        </button>
      </div>

      {/* LISTA TIPO ACORDEÓN */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[30px] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No hay categorías creadas todavía.</p>
          </div>
        ) : (
          categories.map((cat: any) => (
            <div key={cat._id} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">

              {/* ENCABEZADO DEL ACORDEÓN */}
              <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition"
                onClick={() => toggleAccordion(cat._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg border border-blue-100">
                    {cat.count || 0}
                  </div>
                  <div className="flex flex-col">
                    {editingId === cat._id ? (
                      <input
                        value={editName}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat._id)}
                        className="p-1 border-b-2 border-blue-500 outline-none font-bold text-slate-800 bg-transparent"
                      />
                    ) : (
                      <span className="font-bold text-slate-800 text-xl tracking-tight">{cat.name}</span>
                    )}
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                      {cat.count === 1 ? 'Enseñanza registrada' : 'Enseñanzas registradas'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full transition-transform duration-300 ${openId === cat._id ? 'rotate-180 bg-slate-100 text-slate-900' : 'text-slate-400'}`}>
                    <ChevronDown size={24} />
                  </div>
                </div>
              </div>

              {/* CONTENIDO DEL ACORDEÓN (ACCIONES) */}
              {openId === cat._id && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-slate-500 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                    <BookOpen size={16} className="text-blue-500" />
                    <span className="font-bold text-slate-400 uppercase text-[10px]">Slug:</span>
                    <span className="font-mono font-medium text-slate-700">{cat.slug}</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {editingId === cat._id ? (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdate(cat._id); }}
                          className="flex-1 sm:flex-none bg-green-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-green-100 hover:bg-green-700"
                        >
                          <Save size={18} /> Guardar
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                          className="flex-1 sm:flex-none bg-white text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 hover:bg-slate-50"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(cat._id);
                            setEditName(cat.name);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white p-3 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-xl transition font-bold text-sm"
                        >
                          <Pencil size={18} /> Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cat._id, cat.count);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white p-3 text-red-600 hover:bg-red-50 border border-red-100 rounded-xl transition font-bold text-sm"
                        >
                          <Trash2 size={18} /> Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}