'use client';
import { useState, useEffect } from 'react';
import { Pencil, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function GestionDoctrinas() {
  const [doctrinas, setDoctrinas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar las doctrinas desde tu API
  const fetchDoctrinas = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setDoctrinas(data);
    } catch (error) {
      console.error("Error cargando doctrinas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctrinas(); }, []);

  // Función para eliminar
  const eliminarDoctrina = async (id: string, titulo: string) => {
    if (confirm(`¿Estás seguro de eliminar la enseñanza: "${titulo}"?`)) {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert("Doctrina eliminada");
          fetchDoctrinas(); // Recarga la lista automáticamente
        }
      } catch (error) {
        alert("No se pudo eliminar");
      }
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Enseñanzas</h1>
        <Link href="/admin/nueva-doctrina" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition">
          + Nueva Doctrina
        </Link>
      </div>

      <div className="bg-white rounded-[30px] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-5 text-slate-600 font-bold">Título de la Doctrina</th>
              <th className="p-5 text-slate-600 font-bold">Categoría</th>
              <th className="p-5 text-slate-600 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {doctrinas.map((doc: any) => (
              <tr key={doc._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                <td className="p-5">
                  <span className="font-bold text-slate-800 block">{doc.title}</span>
                  <span className="text-xs text-slate-400 font-mono">{doc._id}</span>
                </td>
                <td className="p-5">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {doc.category}
                  </span>
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-2">
                    {/* Botón Ver Online */}
                    <Link href={`/doctrinas/${doc.slug}`} target="_blank" className="p-3 text-slate-400 hover:text-blue-600 transition">
                      <ExternalLink size={20} />
                    </Link>
                    
                    {/* Botón Editar (Crea esta ruta después) */}
                    <Link href={`/admin/editar/${doc._id}`} className="p-3 text-slate-400 hover:text-amber-600 transition">
                      <Pencil size={20} />
                    </Link>

                    {/* Botón Eliminar */}
                    <button 
                      onClick={() => eliminarDoctrina(doc._id, doc.title)}
                      className="p-3 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}