'use client';
import { useState } from 'react';

const categories = [
  "Todas", "Fundamentos de Fe", "Salvación", "Bautismo", "Santidad", "Dones Espirituales", "Escatología"
];

export default function CategoryFilter() {
  const [active, setActive] = useState("Todas");

  return (
    <div className="flex flex-wrap justify-center gap-3 py-8 bg-white">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActive(cat)}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
            active === cat 
              ? "bg-blue-600 text-white border-blue-600 shadow-md" 
              : "bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-white"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}