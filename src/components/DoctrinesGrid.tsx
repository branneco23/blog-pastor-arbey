'use client';
import { useState } from 'react'; // Paso 1: Importar useState
import CategoryFilter from './CategoryFilter';
import BlogCard from './BlogCard';

interface Doctrine {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string; // El ? la hace opcional
  readingTime: string;
  createdAt: string;
  categoryId?: any;
}

export default function DoctrineGrid({ doctrines = [] }: { doctrines: Doctrine[] }) {
  // Paso 2: Crear el estado para la categoría seleccionada
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Paso 3: Filtrar las doctrinas lógicamente
  // CORRECCIÓN EN EL FILTRADO:
  const filteredDoctrines = activeCategory === 'Todas'
    ? doctrines
    : doctrines.filter(item => {
      // Si categoryId es un objeto (populate), comparamos con su nombre
      const categoryName = typeof item.categoryId === 'object'
        ? item.categoryId?.name
        : item.categoryId;

      return categoryName === activeCategory;
    });

  return (
    <section className="bg-slate-50/50 py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Paso 4: Pasar la categoría activa y la función para cambiarla */}
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="mt-12 mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            {activeCategory === 'Todas' ? 'Todas las Doctrinas' : activeCategory}
          </h2>
          <p className="text-slate-500 font-bold mt-2">
            {filteredDoctrines.length} {filteredDoctrines.length === 1 ? 'doctrina' : 'doctrinas'} encontradas
          </p>
        </div>

        {filteredDoctrines.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[48px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No hay enseñanzas en esta categoría aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredDoctrines.map((item) => (
              <BlogCard key={item._id} blog={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}