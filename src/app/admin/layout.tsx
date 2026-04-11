'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState([]); // Estado para la tabla de usuarios

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    
    if (!storedUser) {
      router.push('/');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'admin') {
      router.push('/'); // Redirige si no es admin
    } else {
      setAuthorized(true);
      // Opcional: Cargar usuarios reales aquí
      // fetchUsers(); 
    }
  }, [router]);

  const handleSuspend = async (id: string) => {
    try {
      await fetch(`/api/users/${id}/suspend`, { method: 'PATCH' });
    } catch (error) {
      console.error("Error al suspender:", error);
    }
  };

  // Mientras verifica el admin, no mostramos nada para evitar "flasheos" de contenido
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* --- SECCIÓN GESTIÓN DE USUARIOS --- */}
        <div className="mb-10 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800">Panel de Control de Usuarios</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase text-slate-500 font-semibold">
                  <th className="p-4">Usuario</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user._id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">{user.name}</td>
                      <td className="p-4 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => handleSuspend(user._id)} 
                          className="text-orange-500 hover:text-orange-600 text-sm font-bold"
                        >
                          Suspender
                        </button>
                        <button className="text-red-600 hover:text-red-700 text-sm font-bold">
                          Eliminar Comentarios
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-10 text-center text-slate-400 text-sm">
                      No hay usuarios para mostrar o la lista está cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CONTENIDO DE LA PÁGINA (AQUÍ APARECERÁ EL FORMULARIO) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {children}
        </div>

      </div>
    </div>
  );
}