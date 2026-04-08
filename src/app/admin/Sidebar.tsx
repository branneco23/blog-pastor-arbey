import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Radio } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6 fixed left-0 top-0">
      <div className="mb-10 px-2 font-black text-xl tracking-tight text-blue-400">
        PASTOR ARBEY <span className="text-white">CMS</span>
      </div>
      <nav className="space-y-2">
        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/admin/blogs" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition">
          <FileText size={20} /> Gestionar Blogs
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition">
          <Users size={20} /> Usuarios
        </Link>
        <Link href="/admin/live" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition text-red-400">
          <Radio size={20} /> En Vivo
        </Link>
      </nav>
    </aside>
  );
}