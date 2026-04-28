'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Calendar, PlayCircle, X,
  ThumbsUp, ThumbsDown, MessageSquare, Send
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
}

export default function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados Dinámicos
  const [reactions, setReactions] = useState({ likes: 0, dislikes: 0 });
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
        
        // Cargamos los comentarios desde la API de comentarios para asegurar el populate
        const commRes = await fetch(`/api/blogs/${id}/comments`);
        if (commRes.ok) {
          const commData = await commRes.json();
          setComments(commData);
        }
      } catch (error) {
        console.error("Error al cargar la enseñanza:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}/reactions`);
        if (res.ok) {
          const data = await res.json();
          setReactions(data);
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    if (id) {
      fetchBlogData();
      fetchStats();
    }
  }, [id]);

  const handleReaction = async (type: 'LIKE' | 'DISLIKE') => {
    const savedUser = localStorage.getItem('user_data');
    if (!savedUser) return alert("Debes iniciar sesión para reaccionar");

    try {
      const user = JSON.parse(savedUser);
      const userId = user._id || user.id;

      if (!userId) return alert("Error de sesión: ID no encontrado. Por favor, re-inicia sesión.");

      const res = await fetch(`/api/blogs/${id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          userId: userId,
          blogId: id 
        })
      });

      if (res.ok) {
        const updatedStats = await res.json();
        setReactions(updatedStats);
      }
    } catch (error) {
      console.error("Error al reaccionar:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const savedUser = localStorage.getItem('user_data');
    if (!savedUser) return alert("Debes iniciar sesión para comentar");

    try {
      const user = JSON.parse(savedUser);
      const userId = user._id || user.id;

      if (!userId) return alert("Error de sesión: ID no encontrado. Por favor, re-inicia sesión.");

      setIsSubmitting(true);

      const res = await fetch(`/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment.trim(),
          userId: userId,
          blogId: id // Requerido por el modelo
        })
      });

      if (res.ok) {
        const savedComment = await res.json();

        // Normalizamos la estructura para que coincida con lo que devuelve el GET (userId como objeto)
        const commentWithUser = {
          ...savedComment,
          userId: { _id: userId, name: user.name || "Usuario" }
        };

        setComments((prev) => [commentWithUser, ...prev]);
        setNewComment("");
      } else {
        const err = await res.json();
        alert(err.message || "Error al publicar comentario");
      }
    } catch (error) {
      console.error("Error en la petición de comentario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mediaItems = blog ? [
    ...(blog.videoUrl ? [{ type: 'video', url: blog.videoUrl }] : []),
    ...(Array.isArray(blog.imageUrl) ? blog.imageUrl : [blog.imageUrl]).filter(Boolean)
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

  const getYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg` : "";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white animate-pulse text-slate-400 font-black uppercase text-xs tracking-widest">Cargando enseñanza...</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Contenido no encontrado</div>;

  return (
    <div className="w-full bg-white relative">
      <article className="max-w-4xl mx-auto py-10 md:py-16 px-4">

        <button onClick={() => router.back()} className="mb-10 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] group transition-all hover:text-blue-600">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver Atrás
        </button>

        <header className="mb-12">
          <span className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-blue-100 mb-6">
            {blog.categoryId?.name || 'General'}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-8 tracking-tight">{blog.title}</h1>
          <div className="flex gap-5 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-2 uppercase tracking-tighter"><Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-2 uppercase tracking-tighter"><Clock size={14} /> {blog.readingTime} min de lectura</span>
          </div>
        </header>

        {/* GALERÍA / MEDIA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {mediaItems.map((item: any, idx: number) => {
            const isVideo = item.type === 'video';
            return (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className={`relative rounded-[32px] overflow-hidden cursor-pointer group border border-slate-100 shadow-xl transition-all duration-500
                  ${isVideo ? 'col-span-full aspect-video md:h-[500px] mb-4' : 'aspect-square md:col-span-1'}`}
              >
                <img
                  src={isVideo ? getYoutubeThumbnail(item.url) : (typeof item === 'string' ? item : '')}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  alt="Enseñanza Media"
                />

                {isVideo ? (
                  <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center group-hover:bg-slate-900/40 transition-all">
                    <div className="bg-white p-6 rounded-full shadow-2xl transform transition-transform group-hover:scale-110">
                      <PlayCircle className="text-blue-600" size={50} />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all" />
                )}
              </div>
            );
          })}
        </div>

        {/* CONTENIDO TEXTUAL */}
        <div className="max-w-none">
          <div
            className="prose prose-slate prose-lg max-w-3xl mx-auto mb-20 text-pretty leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* REACCIONES */}
        <div className="flex flex-wrap items-center gap-4 mb-10 py-8 border-y border-slate-50">
          <button
            onClick={() => handleReaction('LIKE')}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 shadow-sm border border-transparent hover:border-blue-100"
          >
            <ThumbsUp size={18} /> {reactions.likes} <span className="hidden sm:inline">Me gusta</span>
          </button>
          <button
            onClick={() => handleReaction('DISLIKE')}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 shadow-sm border border-transparent hover:border-red-100"
          >
            <ThumbsDown size={18} /> {reactions.dislikes} <span className="hidden sm:inline">No me gusta</span>
          </button>
        </div>

        {/* SECCIÓN DE COMENTARIOS */}
        <section className="mt-20">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <MessageSquare size={20} />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Comunidad <span className="text-slate-300 font-light">({comments.length})</span></h3>
          </div>

          <form onSubmit={handleComment} className="mb-16 relative group">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="¿Qué te pareció esta enseñanza? Comparte tu reflexión..."
              className="w-full bg-slate-50 rounded-[32px] p-8 text-slate-700 border-2 border-transparent focus:border-blue-100 focus:bg-white min-h-[150px] outline-none transition-all resize-none shadow-inner"
            />
            <button
              disabled={isSubmitting}
              className="absolute bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50 flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
            >
              {isSubmitting ? "Publicando..." : "Publicar"} <Send size={14} />
            </button>
          </form>

          <div className="grid gap-6">
            {comments.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium italic">No hay reflexiones aún. ¡Sé el primero!</p>
              </div>
            ) : (
              comments.map((c, idx) => (
                <div key={c._id || idx} className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 flex items-center justify-center font-black text-white shadow-lg shadow-blue-100">
                    {(c.userId?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-black text-slate-900 text-sm uppercase tracking-tighter">
                        {c.userId?.name || "Usuario"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Reciente'}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[15px] leading-relaxed break-words">
                      {c.content}
                    </p>
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
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-6xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-16 right-0 text-white p-4 hover:bg-white/10 rounded-full transition-all"
            >
              <X size={32} />
            </button>
            <div className="w-full bg-black rounded-[40px] overflow-hidden shadow-2xl">
              {typeof mediaItems[currentIndex] === 'string' ? (
                <img src={mediaItems[currentIndex] as string} className="w-full h-auto max-h-[85vh] object-contain mx-auto" alt="popup" />
              ) : (
                <div className="w-full aspect-video">
                  <iframe
                    src={`${getEmbedUrl((mediaItems[currentIndex] as any).url)}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}