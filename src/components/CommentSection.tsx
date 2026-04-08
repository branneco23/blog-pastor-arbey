'use client';

import { useState } from 'react';
import { MessageCircle, Send, User as UserIcon } from 'lucide-react';

interface UserPayload {
  id: string;
  name: string;
  role: string;
}

interface Props {
  blogId: string;
  user: UserPayload;
}

export default function CommentSection({ blogId, user }: Props) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/doctrinas/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: commentText,
          userName: user.name // Enviamos el nombre del usuario logueado
        }),
      });

      if (response.ok) {
        setCommentText('');
        setMessage({ type: 'success', text: '¡Amén! Tu comentario ha sido publicado.' });
        // Opcional: Recargar la página o actualizar la lista de comentarios localmente
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'No se pudo enviar el comentario. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="text-blue-600" size={20} />
        <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">
          Escribe tu comentario
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={`Hola ${user.name}, comparte lo que Dios ha puesto en tu corazón...`}
          disabled={isSubmitting}
          className="w-full bg-slate-50 border border-slate-200 rounded-[30px] p-6 pt-8 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none min-h-[150px] placeholder:text-slate-400 font-medium"
        />

        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
          {message && (
            <span className={`text-sm font-bold ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {message.text}
            </span>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-black text-sm uppercase tracking-wide hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
          >
            {isSubmitting ? 'Enviando...' : (
              <>
                Publicar <Send size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}