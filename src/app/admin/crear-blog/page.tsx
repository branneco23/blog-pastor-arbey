'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { X, UploadCloud, ArrowLeft, GripVertical } from 'lucide-react'; 
import 'react-quill-new/dist/quill.snow.css';

// Importación dinámica para evitar errores de SSR en Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <div className="h-64 bg-slate-50 animate-pulse rounded-2xl border border-slate-200" />
});

interface Category {
  id?: string;
  _id?: string;
  name: string;
}

interface ImageItem {
  id: string;
  src: string;
  file?: File;
}

export default function AdminBlogForm() {
  const router = useRouter();

  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    readingTime: '',
    videoUrl: ''
  });

  const getCatId = (cat: Category) => cat.id ?? cat._id ?? '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        const data: Category[] = await res.json();
        setDbCategories(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: getCatId(data[0]) }));
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
      });
    };
  }, [images]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newEntries = filesArray.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        src: URL.createObjectURL(file),
        file: file
      }));
      setImages(prev => [...prev, ...newEntries]);
    }
  };

  const removeImage = (index: number) => {
    const itemToRemove = images[index];
    if (itemToRemove.src.startsWith('blob:')) {
      URL.revokeObjectURL(itemToRemove.src);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // DRAG & DROP LOGIC
  const onDragStart = (index: number) => setDraggedIndex(index);
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setImages(newImages);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!content.trim() || content === '<p><br></p>') {
      alert("El contenido del blog no puede estar vacío");
      return;
    }

    if (images.length === 0) {
      alert("Por favor selecciona al menos una imagen");
      return;
    }

    setLoading(true);

    try {
      const base64Images = await Promise.all(
        images.map(async (img) => {
          if (img.file) return await fileToBase64(img.file);
          return img.src;
        })
      );

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: base64Images,
          content: content, // El HTML generado por ReactQuill
        }),
      });

      if (res.ok) {
        alert('¡Enseñanza publicada con éxito!');
        router.push('/');
        router.refresh();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error en el servidor');
      }
    } catch (err: any) {
      alert(err.message || 'Error al guardar la enseñanza');
    } finally {
      setLoading(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  }), []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button 
        type="button" 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest group hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Volver atrás
      </button>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
        
        {/* GALERÍA REORDENABLE */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
            Galería de Imágenes (La primera será la portada principal)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-blue-200 transition-all">
              <UploadCloud size={24} className="text-slate-400 mb-2" />
              <span className="text-[9px] font-black text-slate-400 uppercase">Añadir</span>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>

            {images.map((img, index) => (
              <div 
                key={img.id}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`relative h-40 group cursor-move transition-all ${draggedIndex === index ? 'opacity-30 scale-95' : 'opacity-100'}`}
              >
                <img 
                  src={img.src} 
                  className={`w-full h-full object-cover rounded-[32px] border-2 ${index === 0 ? 'border-blue-500 shadow-lg' : 'border-slate-100'}`} 
                  alt="preview" 
                />
                
                {index === 0 && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-lg">
                    Portada
                  </span>
                )}

                <button 
                  type="button" 
                  onClick={() => removeImage(index)} 
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12}/>
                </button>

                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100">
                  <GripVertical size={12} className="text-slate-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAMPOS DE TEXTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Título</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" placeholder="Escribe el título..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Doctrina</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none appearance-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-inner">
              {dbCategories.map((cat) => (
                <option key={getCatId(cat)} value={getCatId(cat)}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Descripción Corta</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none resize-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" placeholder="Un pequeño resumen..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="readingTime" value={formData.readingTime} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none shadow-inner" placeholder="Tiempo de lectura (ej: 5 min)" />
          <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none shadow-inner" placeholder="Link YouTube (Opcional)" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contenido de la enseñanza</label>
          <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules} 
              placeholder="Escribe la enseñanza aquí..."
              className="quill-editor"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all ${
            loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 active:scale-[0.98]'
          }`}
        >
          {loading ? 'Subiendo enseñanza...' : 'Publicar Enseñanza'}
        </button>
      </form>

      <style jsx global>{`
        .quill-editor .ql-container {
          min-height: 300px;
          font-size: 16px;
          border-bottom-left-radius: 32px;
          border-bottom-right-radius: 32px;
        }
        .quill-editor .ql-toolbar {
          border-top-left-radius: 32px;
          border-top-right-radius: 32px;
          padding: 12px;
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}