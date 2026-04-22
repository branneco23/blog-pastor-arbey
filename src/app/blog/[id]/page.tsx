'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Clock, Calendar, PlayCircle, X, 
  ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, MessageSquare, Send 
} from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string | string[];
  videoUrl?: string;
  createdAt: string;
  readingTime: string;
  categoryId?: { name: string };
  _count?: {
    reactions: number;
    comments: number;
  };
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para Reacciones y Comentarios
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el Pop-up (Lightbox)
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setBlog(data);
        
        // Cargar reacciones y comentarios (Asumiendo que vienen en el GET del blog o fetch aparte)
        // Por ahora inicializamos con lo que venga del conteo
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error al cargar la enseñanza:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlogData();
  }, [id]);

  const handleReaction = async (type: 'LIKE' | 'DISLIKE') => {
    // Aquí conectarías con la API que creamos antes
    // userId debería venir de tu sistema de sesión (ej. NextAuth)
    try {
      const res = await fetch(`/api/blogs/${id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, userId: "USER_ID_TEMPORAL" })
      });
      if (res.ok) {
        // Actualizar contador localmente o re-fetch
      }
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment, userId: "USER_ID_TEMPORAL" })
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error al comentar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mediaItems = blog ? [
    ...(blog.videoUrl ? [{ type: 'video', url: blog.videoUrl }] : []),
    ...(Array.isArray(blog.imageUrl) ? blog.imageUrl : [blog.imageUrl])
  ] : [];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : "";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white animate-pulse text-slate-400 font-black uppercase text-xs tracking-widest">Cargando enseñanza...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Contenido no encontrado</div>;

  return (
    <div className="w-full bg-white relative">
      <article className="max-w-4xl mx-auto py-10 md:py-16 px-4">

        <button onClick={() => router.back()} className="mb-10 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] group transition-all hover:text-blue-600">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Regresar
        </button>

        <header className="mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100 mb-6">
            {blog.categoryId?.name || 'General'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-8 tracking-tight">{blog.title}</h1>
          <div className="flex gap-5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-2"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Clock size={14} /> {blog.readingTime}</span>
          </div>
        </header>

        {/* EVENTO PRINCIPAL: VIDEO */}
        {blog.videoUrl && (
          <div className="mb-10 group relative cursor-pointer" onClick={() => openLightbox(0)}>
            <div className="flex items-center gap-3 text-slate-900 font-black text-xs uppercase tracking-[0.2em] mb-6">
              <PlayCircle className="text-red-600" size={20} /> Enseñanza en Video
            </div>
            <div className="relative w-full aspect-video rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 bg-slate-900">
              <img
                src={`https://img.youtube.com/vi/${blog.videoUrl.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg`}
                className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                alt="Miniatura Video"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                  <PlayCircle className="text-white" size={40} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GALERÍA DE IMÁGENES */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {(Array.isArray(blog.imageUrl) ? blog.imageUrl : [blog.imageUrl]).map((img, idx) => {
            const mediaIdx = blog.videoUrl ? idx + 1 : idx;
            return (
              <div
                key={idx}
                onClick={() => openLightbox(mediaIdx)}
                className="relative aspect-square rounded-[24px] overflow-hidden cursor-pointer group border border-slate-100 shadow-md shadow-slate-200/50"
              >
                <img src={img} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2" alt="Galería" />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
              </div>
            );
          })}
        </div>

        {/* REACCIONES RAPIDAS */}
        <div className="flex items-center gap-4 mb-10 py-6 border-y border-slate-50">
           <button 
            onClick={() => handleReaction('LIKE')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
           >
             <ThumbsUp size={16} /> Me gusta
           </button>
           <button 
            onClick={() => handleReaction('DISLIKE')}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
           >
             <ThumbsDown size={16} /> No me gusta
           </button>
        </div>

        {/* CONTENIDO TEXTUAL */}
        <div className="max-w-none mt-10">
          <div className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
            <span className="h-[1px] flex-1 bg-slate-100"></span>
            Estudio Bíblico
            <span className="h-[1px] flex-1 bg-slate-100"></span>
          </div>

          <div
            className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap break-normal text-left mb-20"
            style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* SECCIÓN DE COMENTARIOS */}
        <section className="mt-20 pt-10 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-10">
            <MessageSquare className="text-blue-600" size={24} />
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Comentarios ({comments.length})</h3>
          </div>

          {/* Formulario de comentario */}
          <form onSubmit={handleComment} className="mb-12 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe una reflexión o pregunta..."
              className="w-full bg-slate-50 rounded-[24px] p-6 text-slate-700 border-none focus:ring-2 focus:ring-blue-100 min-h-[120px] outline-none transition-all resize-none"
            />
            <button 
              disabled={isSubmitting}
              className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Lista de comentarios */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-slate-400 py-10 font-medium italic">Sé el primero en compartir una reflexión...</p>
            ) : (
              comments.map((c, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-[24px] bg-white border border-slate-50 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase text-xs">
                    {c.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900 text-sm">{c.user?.name || "Usuario"}</span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </article>

      {/* LIGHTBOX POP-UP */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-5xl h-fit">
            <button onClick={() => setIsOpen(false)} className="absolute -top-14 right-0 text-white hover:text-blue-400 transition-all p-2 bg-white/10 rounded-full">
              <X size={24} />
            </button>
            {mediaItems.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length); }} className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-2">
                  <ChevronLeft size={50} strokeWidth={1} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev + 1) % mediaItems.length); }} className="absolute -right-4 md:-right-20 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-2">
                  <ChevronRight size={50} strokeWidth={1} />
                </button>
              </>
            )}
            <div className="w-full bg-black rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center min-h-[300px]">
              {typeof mediaItems[currentIndex] === 'string' ? (
                <img src={mediaItems[currentIndex] as string} className="max-w-full max-h-[80vh] object-contain select-none" alt="popup content" />
              ) : (
                <div className="w-full aspect-video bg-black">
                  <iframe src={`${getEmbedUrl((mediaItems[currentIndex] as any).url)}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
              {currentIndex + 1} / {mediaItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}