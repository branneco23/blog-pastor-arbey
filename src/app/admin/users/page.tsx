'use client';
import { useState, useEffect } from 'react';
import { Trash2, ShieldAlert, ShieldCheck, Loader2, Eye } from 'lucide-react';

// 1. Definimos la estructura exacta según tu JSON de la API
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean; // Coincide con tu JSON
  actividad: {
    total: number;
    comentarios: any[];
    reacciones: any[];
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Carga de usuarios desde la API
  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 3. Función corregida para cambiar el estado de bloqueo
  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'desbloquear' : 'bloquear';
    if (!confirm(`¿Deseas ${action} a este usuario?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos el nuevo estado opuesto al actual
        body: JSON.stringify({ userId, isBlocked: !currentStatus })
      });

      if (res.ok) {
        loadUsers(); // Recargamos la lista
      }
    } catch (error) {
      alert("Error al actualizar el estado");
    }
  };

  // 4. Función para eliminar usuario
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('¿Eliminar usuario y toda su actividad permanentemente? Esta acción no se puede deshacer.')) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (res.ok) {
        loadUsers();
      }
    } catch (error) {
      alert("Error al eliminar el usuario");
    }
  };

  const handleUpdateEstado = async (userId: string, blockedStatus: boolean) => {
    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isBlocked: blockedStatus })
    });
    loadUsers(); // Esto refresca la tabla automáticamente tras el cambio
  };

  // 5. Función para ver actividad
  const verActividad = (user: User) => {
    const info = user.actividad;
    alert(
      `Resumen de actividad - ${user.name}:\n\n` +
      `• Total interacciones: ${info.total}\n` +
      `• Comentarios realizados: ${info.comentarios?.length || 0}\n` +
      `• Reacciones: ${info.reacciones?.length || 0}`
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Cargando Miembros...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
            Control de <span className="text-blue-600">Miembros</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona los accesos y revisa la actividad de la comunidad.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Información de Usuario</th>
              <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Actividad Reciente</th>
              <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Estado de Acceso</th>
              <th className="p-6 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right">Gestión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400 italic">
                  No se encontraron usuarios registrados en la base de datos.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs border border-slate-200">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-400 font-medium tracking-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button
                      onClick={() => verActividad(user)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-wider hover:border-blue-200 hover:text-blue-600 shadow-sm transition-all active:scale-95"
                    >
                      <Eye size={14} className="text-blue-500" />
                      {user.actividad?.total || 0} Interacciones
                    </button>
                  </td>
                  <td className="p-6 text-center">
                    <span className={`inline-block text-[10px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest ${!user.isBlocked
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                      {user.isBlocked ? 'Acceso Restringido' : 'Usuario Activo'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        className={`p-3 rounded-2xl transition-all shadow-sm border ${!user.isBlocked
                            ? "text-amber-500 bg-white border-amber-100 hover:bg-amber-50"
                            : "text-green-500 bg-white border-green-100 hover:bg-green-50"
                          }`}
                        title={user.isBlocked ? "Habilitar Usuario" : "Suspender Usuario"}
                      >
                        {user.isBlocked ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-3 text-red-500 bg-white border border-red-100 rounded-2xl hover:bg-red-50 shadow-sm transition-all"
                        title="Eliminar de la base de datos"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}