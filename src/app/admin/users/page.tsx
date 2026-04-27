'use client';
import { useState, useEffect } from 'react';
import { Trash2, ShieldAlert, ShieldCheck, MessageSquare, UserX, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleAction = async (userId: string, action: string) => {
    const confirmMsg = action === 'delete' ? '¿Eliminar usuario permanentemente?' : '¿Cambiar estado de bloqueo?';
    if (!confirm(confirmMsg)) return;

    await fetch('/api/admin/users', {
      method: 'PATCH',
      body: JSON.stringify({ userId, action })
    });
    loadUsers();
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline" /></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Panel de Control de Usuarios</h1>
      
      <div className="bg-white rounded-[30px] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-5 font-bold">Usuario</th>
              <th className="p-5 font-bold text-center">Comentarios</th>
              <th className="p-5 font-bold text-center">Estado</th>
              <th className="p-5 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50">
                <td className="p-5">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </td>
                <td className="p-5 text-center">
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <MessageSquare size={14} /> {user._count.comments}
                  </span>
                </td>
                <td className="p-5 text-center">
                  {user.isBlocked ? 
                    <span className="text-red-500 text-xs font-black uppercase">Bloqueado</span> : 
                    <span className="text-green-500 text-xs font-black uppercase">Activo</span>
                  }
                </td>
                <td className="p-5 text-right space-x-2">
                  <button onClick={() => handleAction(user.id, 'toggleBlock')} className="p-2 hover:bg-slate-100 rounded-lg">
                    {user.isBlocked ? <ShieldCheck className="text-green-600" /> : <ShieldAlert className="text-amber-600" />}
                  </button>
                  <button onClick={() => handleAction(user.id, 'delete')} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}