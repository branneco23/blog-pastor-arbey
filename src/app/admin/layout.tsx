'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // Estado para los usuarios reales

  // 1. Cargar usuarios reales al montar el componente
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      // Guardamos los usuarios (limitado a los más recientes para el layout)
      setUsers(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (error) {
      console.error("Error cargando usuarios en layout:", error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');

    if (!storedUser) {
      router.push('/');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'admin') {
      router.push('/');
    } else {
      setAuthorized(true);
      fetchUsers(); // Llamamos a la función aquí
    }
  }, [router]);

  // Dentro de src/app/admin/layout.tsx

  const handleSuspend = async (userId: string, currentStatus: boolean) => {
    if (!confirm("¿Cambiar estado de acceso de este usuario?")) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          isBlocked: !currentStatus // Enviamos el valor opuesto al actual
        })
      });

      if (res.ok) {
        // Si la respuesta es exitosa, refrescamos la lista
        fetchUsers();
      } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);
        alert("Error al actualizar en el servidor");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* --- SECCIÓN GESTIÓN DE USUARIOS (Sincronizada) --- */}
        <div className="mb-10 bg-white rounded-[30px] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Panel de Control de Usuarios</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/30 text-left text-[10px] uppercase text-slate-400 font-bold tracking-tighter">
                  <th className="p-4 pl-6">Usuario</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-700">{user.name}</span>
                          <span className="text-[10px] text-slate-400">{user.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6 flex justify-end items-center gap-4">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${!user.isBlocked ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                          {user.isBlocked ? 'Bloqueado' : 'Activo'}
                        </span>
                        <button
                          onClick={() => handleSuspend(user._id, user.isBlocked)}
                          className={`${user.isBlocked ? 'text-green-600' : 'text-orange-500'} hover:underline text-[11px] font-bold uppercase`}
                        >
                          {user.isBlocked ? 'Activar' : 'Suspender'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-10 text-center text-slate-400 text-xs italic">
                      No hay usuarios registrados o la lista está cargando...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- CONTENIDO DINÁMICO (Dashboard, Editar, etc.) --- */}
        <div className="bg-white rounded-[30px] shadow-sm border border-slate-200 p-8">
          {children}
        </div>

      </div>
    </div>
  );
}