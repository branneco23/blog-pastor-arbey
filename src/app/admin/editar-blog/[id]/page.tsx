'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { X, UploadCloud, ArrowLeft, GripVertical } from 'lucide-react'; 
import 'react-quill-new/dist/quill.snow.css';

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

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams();

  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // ESTADO PARA IMÁGENES REORDENABLES
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const [content, setContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    readingTime: '',
    videoUrl: ''
  });

  // CARGAR DATOS
  useEffect(() => {
    const loadData = async () => {
      try {
        const resCats = await fetch('/api/categories');
        const categories = await resCats.json();
        setDbCategories(categories);

        const resBlog = await fetch(`/api/blogs/${id}`);
        if (resBlog.ok) {
          const blog = await resBlog.json();
          setFormData({
            title: blog.title || '',
            categoryId: blog.categoryId?._id || blog.categoryId || '',
            description: blog.description || '',
            readingTime: blog.readingTime || '',
            videoUrl: blog.videoUrl || ''
          });
          setContent(blog.content || '');
          
          // --- CORRECCIÓN: CARGAR MÚLTIPLES IMÁGENES DESDE DB ---
          if (blog.imageUrl) {
            const imgs = Array.isArray(blog.imageUrl) ? blog.imageUrl : [blog.imageUrl];
            const loadedImages = imgs.map((url: string, index: number) => ({
              id: `old-${index}`,
              src: url
            }));
            setImages(loadedImages);
          }
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

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
    setImages(prev => prev.filter((_, i) => i !== index));
  };

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
    setUpdating(true);

    try {
      if (images.length === 0) {
        alert("Debes tener al menos una imagen");
        setUpdating(false);
        return;
      }

      // --- CORRECCIÓN: CONVERTIR SOLO LAS NUEVAS Y ENVIAR ARRAY ---
      const finalImagesArray = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            return await fileToBase64(img.file);
          }
          return img.src; // Si no hay file, es porque ya es la URL/Base64 de la DB
        })
      );

      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImagesArray, // ENVIAMOS EL ARRAY COMPLETO REORDENADO
          content
        }),
      });

      if (res.ok) {
        alert('¡Enseñanza actualizada con éxito!');
        router.push(`/blog/${id}`);
        router.refresh();
      }
    } catch (err) {
      alert('Error al actualizar');
    } finally {
      setUpdating(false);
    }
  };

  const modules = useMemo(() => ({
    toolbar: [[{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image', 'video'], ['clean']],
  }), []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center animate-pulse text-slate-400 font-black uppercase tracking-widest text-xs">Cargando datos de enseñanza...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Regresar
      </button>

      <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white rounded-[40px] shadow-sm border border-slate-100">
        
        {/* GALERÍA REORDENABLE */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Imágenes (Arrastra para reordenar)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-[32px] cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
              <UploadCloud size={24} className="text-slate-400 mb-2" />
              <span className="text-[9px] font-black text-slate-400 uppercase">Subir más</span>
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
                <img src={img.src} className={`w-full h-full object-cover rounded-[32px] border-2 ${index === 0 ? 'border-blue-500 shadow-md' : 'border-slate-100'}`} alt="preview" />
                {index === 0 && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">Portada</span>}
                <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                <div className="absolute top-2 left-2 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100"><GripVertical size={12} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* INPUTS DE TEXTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Título</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Doctrina</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              {dbCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Descripción resumida</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={2} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none resize-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="readingTime" value={formData.readingTime} onChange={handleChange} placeholder="Tiempo lectura (ej: 5 min)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none shadow-inner" />
          <input name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="URL de Video (YouTube)" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none shadow-inner" />
        </div>

        <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-inner">
          <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} />
        </div>

        <button 
          type="submit" 
          disabled={updating} 
          className={`w-full py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] transition-all ${
            updating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200'
          }`}
        >
          {updating ? 'Guardando cambios...' : 'Actualizar Enseñanza'}
        </button>
      </form>
    </div>
  );
}