import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// 1. Función para obtener los datos desde la API
async function getBlog(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/blogs/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

// 2. Lógica para renderizar texto, imágenes y videos intercalados
const renderContent = (text: string) => {
  // Expresión regular para detectar [img:...] o [vid:...]
  const parts = text.split(/(\[img:.*?\]|\[vid:.*?\])/g);

  return parts.map((part, index) => {
    // Renderizar IMAGEN si detecta el shortcode
    if (part.startsWith('[img:')) {
      const url = part.replace('[img:', '').replace(']', '').trim();
      return (
        <div key={index} className="my-12 group">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-50 transition-transform duration-500 hover:scale-[1.02]">
            <img src={url} alt="Imagen de apoyo" className="w-full h-auto object-cover" />
          </div>
        </div>
      );
    }

    // Renderizar VIDEO si detecta el shortcode
    if (part.startsWith('[vid:')) {
      const rawUrl = part.replace('[vid:', '').replace(']', '').trim();
      const embedUrl = rawUrl.replace("watch?v=", "embed/").split("&")[0];
      return (
        <div key={index} className="my-12">
          <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      );
    }

    // Renderizar TEXTO normal (si no es un código)
    return (
      <p key={index} className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg md:text-xl font-medium mb-8">
        {part}
      </p>
    );
  });
};

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  // Desvolvemos los params según el estándar actual de Next.js
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">404</h1>
          <p className="text-slate-500 font-bold">La enseñanza no pudo ser encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <article className="max-w-4xl mx-auto px-6 py-24">
        {/* Cabecera de la enseñanza */}
        <header className="text-center mb-16">
          <span className="bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full mb-8 inline-block shadow-sm shadow-blue-100">
            {blog.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-slate-400 font-bold text-sm uppercase tracking-widest">
            <span>{new Date(blog.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            <span>{blog.readingTime}</span>
          </div>
        </header>

        {/* Portada Principal */}
        <div className="rounded-[56px] overflow-hidden shadow-2xl mb-20 aspect-[16/9] ring-1 ring-slate-100">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Cuerpo del Blog Procesado */}
        <div className="max-w-3xl mx-auto">
          {/*Busca el lugar donde renderizas el contenido del blog*/}
          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Si el Pastor usó el campo de video original del formulario, también lo mostramos al final */}
          {blog.videoUrl && !blog.content.includes(blog.videoUrl) && (
            <div className="mt-20 pt-16 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-10">Video de Referencia</h3>
              <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-slate-100">
                <iframe
                  className="w-full h-full"
                  src={blog.videoUrl.replace("watch?v=", "embed/").split("&")[0]}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}