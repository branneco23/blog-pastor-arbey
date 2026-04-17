'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserAdmin {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
  reacciones: any[]; // Aquí vendrán los likes/corazones
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">
        Gestión de Miembros
      </h2>

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase">Usuario</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase">Rol</th>
              <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase">Actividad (Reacciones)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900">{user.nombre}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                    user.rol === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {user.reacciones.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.reacciones.map((reac, idx) => (
                        <span key={idx} title={reac.blogId?.title} className="text-lg">
                          {reac.tipo === 'like' ? '👍' : '❤️'}
                        </span>
                      ))}
                      <span className="text-xs text-slate-400 self-center ml-1">
                        ({user.reacciones.length})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300 italic">Sin actividad</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}