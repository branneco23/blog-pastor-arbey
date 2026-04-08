'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function DoctrinesGrid() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llamamos a tu propia carpeta api/blogs
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-black text-slate-900 mb-2">Todas las Doctrinas</h2>
      <p className="text-slate-500 mb-10">{blogs.length} doctrinas</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog: any) => (
          <article key={blog._id} className="bg-white rounded-[25px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow">
            {/* Imagen con Badge */}
            <div className="relative aspect-video">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {blog.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                {blog.description}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-50">
                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> 
                    {new Date(blog.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {blog.readingTime}
                  </span>
                </div>
                <Link href={`/posts/${blog._id}`} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Leer más <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}