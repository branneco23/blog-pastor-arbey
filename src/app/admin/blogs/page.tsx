'use client';
import { useEffect, useState } from 'react';
import { Edit3, Trash, MessageSquare, Clock, Calendar, PlayCircle, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ManageBlogs() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Aquí filtramos por el usuario actual en el backend si es necesario
    fetch('/api/admin/blogs').then(res => res.json()).then(setPosts);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase italic">Mis <span className="text-blue-600">Publicaciones</span></h1>
        <p className="text-slate-500 font-medium">Gestiona y revisa el impacto de tus enseñanzas.</p>
      </div>

      <div className="grid gap-6">
        {posts.map((post: any) => (
          <div key={post._id} className="bg-white p-5 rounded-[30px] border border-slate-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-all">
            
            <div className="flex items-center gap-6 w-full">
              {/* Miniatura: Prioriza video si existe, sino imagen */}
              <div className="relative w-24 h-24 shrink-0">
                <img src={post.image || '/placeholder.png'} className="w-full h-full rounded-[20px] object-cover" alt="" />
                {post.videoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[20px]">
                    <PlayCircle className="text-white" size={24} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                  {post.image && post.videoUrl && <span className="text-[10px] font-bold text-slate-400 italic">Multimedia mixta</span>}
                </div>

                <h3 className="font-black text-xl text-slate-800 leading-tight">{post.title}</h3>
                
                {/* Fecha debajo del título */}
                <div className="flex flex-wrap gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Calendar size={14} className="text-slate-300" />
                    {new Date(post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                    <Clock size={14} className="text-slate-300" />
                    {post.readingTime || '5 min'} de lectura
                  </span>
                </div>
              </div>
            </div>
            
            {/* Acciones */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link href={`/admin/blogs/edit/${post._id}`} className="p-3 text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition">
                <Edit3 size={20} />
              </Link>
              <button className="p-3 text-red-500 bg-red-50/50 hover:bg-red-50 rounded-2xl transition">
                <Trash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}