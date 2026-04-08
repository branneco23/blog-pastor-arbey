'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Traemos los blogs de la API que creamos antes
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, 3))); // Solo mostramos los 3 últimos
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Palabras de Vida</h2>
          <p className="text-slate-500 mt-2 font-medium">Reflexiones recientes del Pastor Arbey</p>
        </div>
        <Link href="/blogs" className="text-blue-600 font-bold flex items-center gap-2 hover:underline">
          Ver todas <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {posts.length === 0 ? (
          <p className="text-slate-400 col-span-3 text-center py-10">Cargando reflexiones...</p>
        ) : (
          posts.map((post: any) => (
            <article key={post._id} className="group cursor-pointer">
              <div className="overflow-hidden rounded-3xl mb-4 bg-slate-100 aspect-video">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase mb-2">
                <Calendar size={14} />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition">
                {post.title}
              </h3>
            </article>
          ))
        )}
      </div>
    </section>
  );
}