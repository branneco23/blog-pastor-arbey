import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CardProps {
  category: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

export default function DoctrineCard({ category, title, description, date, readTime, image, slug }: CardProps) {
  return (
    <div className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Imagen con Badge */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <span className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">
          {category}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-7 flex flex-col flex-1">
        <h3 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
          {description}
        </p>

        {/* Metadatos */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-4 text-[12px] font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} /> {readTime}
            </span>
          </div>
          <Link href={`/doctrinas/${slug}`} className="flex items-center gap-1 text-blue-600 font-bold text-sm hover:gap-2 transition-all">
            Leer más <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}