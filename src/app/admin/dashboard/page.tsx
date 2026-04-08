'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetch('/api/blogs').then(res => res.json()).then(setBlogs);
  }, []);

  const toggleLive = async () => {
    setIsLive(!isLive);
    // Aquí llamarías a una API para actualizar el estado global del "En Vivo"
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Panel del Pastor</h1>
        <button 
          onClick={toggleLive}
          className={`px-6 py-2 rounded-full font-bold text-white transition ${isLive ? 'bg-red-600 animate-pulse' : 'bg-slate-400'}`}
        >
          {isLive ? '🔴 EN VIVO' : 'Iniciar Transmisión'}
        </button>
      </div>

      <div className="grid gap-6">
        <h2 className="text-xl font-semibold">Blogs Publicados</h2>
        {blogs.map((blog: any) => (
          <div key={blog._id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-lg">{blog.title}</p>
              <p className="text-sm text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-blue-600 font-medium">Editar</button>
              <button className="text-red-600 font-medium">Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}