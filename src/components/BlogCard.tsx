'use client';
import Link from 'next/link';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    description: string;
    categoryId?: any;
    // CORRECCIÓN: Agregamos '?' para que sea opcional y evitar errores de build
    imageUrl?: string; 
    readingTime?: string;
    createdAt: string;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  // Desestructuramos con valores por defecto para mayor seguridad
  const { 
    _id, 
    title, 
    description, 
    categoryId, 
    imageUrl, 
    readingTime = '5 min', 
    createdAt 
  } = blog;

  const categoryName = typeof categoryId === 'object' ? categoryId?.name : 'General';

  const formatDate = (dateString: string) => {
    if (!dateString) return "Reciente";
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? "Reciente" 
      : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      {/* Contenedor de Imagen */}
      <div className="relative p-3">
        <div className="relative h-64 w-full overflow-hidden rounded-[32px] bg-slate-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest">
              Sin Portada
            </div>
          )}
          
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-sm border border-slate-100/50">
              {categoryName}
            </span>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 pt-2 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-3">
          <span>{formatDate(createdAt)}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{readingTime}</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {description}
        </p>

        <div className="mt-auto">
          <Link 
            href={`/blog/${_id}`} 
            className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest group/btn"
          >
            Leer enseñanza 
            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}