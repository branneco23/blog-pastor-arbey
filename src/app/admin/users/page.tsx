'use client';

import { useEffect, useState } from 'react';
import { User, Trash2, Ban, CheckCircle, ShieldCheck } from 'lucide-react';

// Esto quita los errores de "implicitly has an any type"
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

  // Función para traer usuarios de tu API
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
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

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if(confirm(`¿Deseas cambiar el estado del usuario a ${newStatus}?`)) {
      await fetch(`/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchUsers(); // Recargar lista
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Cargando comunidad...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <User className="text-blue-600" size={32} /> Gestión de Usuarios
      </h1>

      <div className="bg-white rounded-[30px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Usuario</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Rol</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">{user.name}</span>
                    <span className="text-xs text-slate-400">{user.email}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit ${
                    user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role === 'admin' && <ShieldCheck size={12} />}
                    {user.role}
                  </span>
                </td>
                <td className="p-5">
                  <span className={`text-[10px] font-black uppercase ${user.status === 'active' ? 'text-emerald-500' : 'text-red-500'}`}>
                    ● {user.status === 'active' ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleStatus(user._id, user.status)}
                      className={`p-2 rounded-xl ${user.status === 'active' ? 'text-orange-500 hover:bg-orange-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                    >
                      {user.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                      <Trash2 size={18} />
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