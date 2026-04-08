'use client';
import { useEffect, useState } from 'react';
import { Edit3, Trash, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ManageBlogs() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/blogs').then(res => res.json()).then(setPosts);
  }, []);

  const handleDelete = async (id: string) => {
    if(!confirm("¿Borrar esta publicación permanentemente?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter((p: any) => p._id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Mis Publicaciones</h1>
        <Link href="/admin/posts/new" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition">
          + Nuevo Blog
        </Link>
      </div>

      <div className="grid gap-4">
        {posts.map((post: any) => (
          <div key={post._id} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <img src={post.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
              <div>
                <h3 className="font-bold text-slate-800">{post.title}</h3>
                <div className="flex gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><MessageSquare size={12}/> {post.comments?.length || 0} comentarios</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Link href={`/admin/blogs/edit/${post._id}`} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <Edit3 size={20} />
              </Link>
              <button onClick={() => handleDelete(post._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                <Trash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}