'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Image as ImageIcon, Type, AlignLeft, Clock, Video } from 'lucide-react';

export default function AdminBlogForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Estado inicial para reutilizar en el reset
    const initialFormState = {
        title: '',
        description: '',
        content: '',
        image: '',
        videoUrl: '',
        category: 'Reflexión',
        readingTime: '5 min'
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/admin/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("¡Gloria a Dios! Blog publicado con éxito.");
                setFormData(initialFormState); // Reset completo
                
                // Opcional: Redirigir al inicio para ver el nuevo blog
                router.push('/');
                router.refresh(); 
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'No se pudo publicar'}`);
            }
        } catch (error) {
            console.error("Error al publicar:", error);
            alert("Error de conexión al publicar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Type size={24} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Nueva Enseñanza</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Título del Blog</label>
                    <input
                        required
                        type="text"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Ej: La Unidad de Dios"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1">Categoría</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="Fundamentos de Fe">Fundamentos de Fe</option>
                        <option value="Salvación">Salvación</option>
                        <option value="Bautismo">Bautismo</option>
                        <option value="Santidad">Santidad</option>
                        <option value="Reflexión">Reflexión</option>
                        <option value="Escatología">Escatología</option>
                        <option value="Dones Espirituales">Dones Espirituales</option>
                    </select>
                </div>
            </div>

            {/* Descripción corta */}
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Descripción corta (Resumen para la card)</label>
                <textarea
                    required
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Un breve resumen de lo que trata esta doctrina..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            {/* URL de Imagen y Tiempo de lectura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                        <ImageIcon size={12} /> URL de la Imagen
                    </label>
                    <input
                        required
                        type="url"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="https://tu-imagen.jpg"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                        <Clock size={12} /> Tiempo de lectura
                    </label>
                    <input
                        required
                        type="text"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-700"
                        placeholder="Ej: 8 min"
                        value={formData.readingTime}
                        onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    />
                </div>
            </div>

            {/* Link de Video */}
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                    <Video size={12} /> Link de Video (YouTube/Vimeo) - Opcional
                </label>
                <input
                    type="url"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
            </div>

            {/* Contenido Completo */}
            <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 ml-1 flex items-center gap-1">
                    <AlignLeft size={12} /> Cuerpo del Blog (Contenido Principal)
                </label>
                <textarea
                    required
                    rows={8}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Escribe aquí toda la enseñanza..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
            </div>

            <button
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-100 disabled:opacity-50"
            >
                <Save size={20} />
                {loading ? 'PUBLICANDO...' : 'PUBLICAR ENSEÑANZA'}
            </button>
        </form>
    );
}