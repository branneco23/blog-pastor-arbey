'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CategoryFilter from '@/components/CategoryFilter';
import BlogCard from '@/components/BlogCard'; 
import Hero from '@/components/Hero';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [currentCat, setCurrentCat] = useState("Todas");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Cargar el usuario del localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error al parsear user_data");
      }
    }
  }, []);

  // 2. Cargar los blogs de la API con validación de respuesta
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs');
        
        // CORRECCIÓN: Validar que la respuesta sea exitosa (200 OK)
        if (!res.ok) {
          throw new Error(`Error en la API: ${res.status}`);
        }

        const data = await res.json();
        setBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        // CORRECCIÓN: Evita el crash si el JSON viene vacío o malformado
        console.error("Error al cargar blogs:", error);
        setBlogs([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // 3. LÓGICA DE FILTRADO
  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog: any) => {
        if (currentCat === "Todas") return true;

        const nombreCategoriaBlog = typeof blog.categoryId === 'object' 
          ? blog.categoryId?.name 
          : blog.categoryId;

        return nombreCategoriaBlog?.toLowerCase().trim() === currentCat.toLowerCase().trim();
      })
    : [];

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Doctrinas Bíblicas</h1>
          <p className="text-slate-500 mt-2">Explora las enseñanzas y fundamentos de la fe del Pastor Arbey</p>
        </header>

        <CategoryFilter
          activeCategory={currentCat}
          onCategoryChange={setCurrentCat}
          isAdmin={user?.role === 'admin'}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {filteredBlogs.map((blog: any) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {filteredBlogs.length === 0 && (
              <div className="text-center mt-20">
                <p className="text-slate-400 italic">
                  No hay doctrinas publicadas en la categoría "{currentCat}" todavía.
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}