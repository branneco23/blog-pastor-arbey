'use client';

import { useEffect, useState } from 'react';
import { User, Trash2, Ban, CheckCircle, ShieldCheck } from 'lucide-react';

// Interfaz para el tipado de TypeScript
interface UserData {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para traer usuarios desde tu servidor Docker
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('No se pudieron obtener los usuarios');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para cambiar el estado (Activo / Suspendido)
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    if (confirm(`¿Deseas cambiar el estado del usuario a ${newStatus === 'active' ? 'Activo' : 'Suspendido'}?`)) {
      try {
        // Ajustamos a PUT y a la ruta base de usuarios si no tienes creada la sub-ruta /status
        await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: id, 
            updateData: { status: newStatus } 
          })
        });
        fetchUsers(); // Recarga la lista para ver el cambio
      } catch (error) {
        alert("Error al actualizar el estado");
      }
    }
  };

  // Función para eliminar usuario (Opcional pero recomendada)
  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este usuario? Esta acción es irreversible.")) {
      try {
        await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: id })
        });
        fetchUsers();
      } catch (error) {
        alert("No se pudo eliminar el usuario");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando comunidad...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <User className="text-blue-600" size={32} /> Gestión de Usuarios
      </h1>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Usuario</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400 italic">No hay usuarios registrados aún.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-lg">{user.name}</span>
                      <span className="text-xs text-slate-400">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${
                      user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' && <ShieldCheck size={14} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase ${
                      user.status === 'active' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      <span className={`h-2 w-2 rounded-full animate-pulse ${
                        user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></span>
                      {user.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleStatus(user._id, user.status)}
                        title={user.status === 'active' ? 'Suspender' : 'Activar'}
                        className={`p-3 rounded-2xl transition-all ${
                          user.status === 'active' 
                            ? 'text-orange-500 bg-orange-50 hover:bg-orange-100' 
                            : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {user.status === 'active' ? <Ban size={20} /> : <CheckCircle size={20} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-2xl transition-all"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={20} />
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