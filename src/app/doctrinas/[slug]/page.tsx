import { connectDB } from '@/lib/db';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User as UserIcon, ChevronLeft } from 'lucide-react';
import CommentSection from '@/components/CommentSection';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();
  const blog = await Blog.findOne({ slug }).lean();

  if (!blog) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const user = token ? await verifyToken(token) : null;

  return (
    <article className="min-h-screen bg-white">
      {/* CORRECCIÓN: Botón Volver usando Link en lugar de router.back() */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-[0.2em] transition-colors group"
        >
          <span className="text-lg transition-transform group-hover:-translate-x-1">←</span>
          Volver atrás
        </Link>
      </div>

      {/* ENCABEZADO */}
      <header className="max-w-4xl mx-auto px-6 py-12">
        <span className="bg-blue-100 text-blue-600 text-[10px] font-black uppercase px-4 py-1.5 rounded-full mb-6 inline-block">
          {blog.category}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-8">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold border-b border-slate-100 pb-8">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-500" />
            {new Date(blog.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            {blog.readingTime || '8 min'} de lectura
          </div>
        </div>
      </header>

      {/* IMAGEN PRINCIPAL */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* CONTENIDO DEL BLOG */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:text-slate-900
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-900">
          
          <p className="text-xl text-slate-500 font-medium italic mb-8">
            {blog.description}
          </p>
          <div dangerouslySetInnerHTML={{ __html: blog.content || '<p>Contenido en desarrollo...</p>' }} />
        </div>

        {/* SECCIÓN DE COMENTARIOS */}
        <section className="mt-20 pt-12 border-t border-slate-100 mb-20">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Conversación</h2>

          {user ? (
            <CommentSection
              blogId={blog._id.toString()}
              user={user as any}
            />
          ) : (
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-[30px] text-center">
              <UserIcon className="mx-auto mb-4 text-slate-300" size={40} />
              <p className="text-slate-600 font-bold mb-4">
                Únete a la comunidad para participar en esta enseñanza.
              </p>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-wide hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Iniciar Sesión para comentar
              </Link>
            </div>
          )}
        </section>
      </div>
    </article>
  );
}