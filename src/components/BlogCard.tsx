'use client';
import Link from 'next/link';

interface BlogCardProps {
  blog: {
    _id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    readingTime: string;
    createdAt: string;
  };
}

// Recibimos "blog" como prop principal
export default function BlogCard({ blog }: BlogCardProps) {
  // Desestructuramos del objeto blog para usar las variables fácilmente
  const { _id, title, description, category, image, readingTime, createdAt } = blog;

  // Función segura para la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Reciente";
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full">
      {/* Imagen */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs uppercase">Sin imagen</div>
        )}
        <div className="absolute top-5 left-5">
          <span className="bg-white/95 backdrop-blur-md text-blue-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-sm">
            {category || 'General'}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-4">
          <span>{formatDate(createdAt)}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span>{readingTime || '5 min'}</span>
        </div>

        <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title || 'Título no disponible'}
        </h3>
        
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8">
          {description || 'Sin descripción disponible para esta enseñanza.'}
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