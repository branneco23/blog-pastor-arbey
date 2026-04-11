'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import BlogCard from '@/components/BlogCard'; // Tu componente de tarjetas
import Hero from '@/components/Hero';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [currentCat, setCurrentCat] = useState("Todas");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // 1. Cargar el usuario del localStorage para saber si es Admin
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 2. Cargar los blogs de la API
  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  // 3. Filtrar los blogs según la categoría seleccionada
  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog: any) => currentCat === "Todas" ? true : blog.category === currentCat)
    : [];

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase">Doctrinas Bíblicas</h1>
          <p className="text-slate-500 mt-2">Explora las enseñanzas y fundamentos de la fe</p>
        </header>

        {/* AQUÍ VA EL COMPONENTE CON SUS PROPS */}
        <CategoryFilter
          activeCategory={currentCat}
          onCategoryChange={setCurrentCat}
          isAdmin={user?.role === 'admin'}
        />

        {/* Renderizado de los Blogs filtrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {filteredBlogs.map((blog: any) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <p className="text-center text-slate-400 mt-20 italic">
            No hay doctrinas publicadas en esta categoría todavía.
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}