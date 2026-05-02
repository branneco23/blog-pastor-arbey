'use client';

import { useState, useEffect } from 'react';
import { Send, Reply, Trash2, CheckCircle, User } from 'lucide-react';

// --- COMPONENTE DE ENTRADA (Para evitar pérdida de foco al escribir) ---
const InputForo = ({ alEnviar, placeholder, autoFocus = false }: any) => {
  const [textoLocal, setTextoLocal] = useState("");

  const manejarEnvio = () => {
    if (!textoLocal.trim()) return;
    alEnviar(textoLocal);
    setTextoLocal("");
  };

  return (
    <div className="flex gap-2 w-full animate-in fade-in slide-in-from-top-1">
      <input
        autoFocus={autoFocus}
        className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        placeholder={placeholder}
        value={textoLocal}
        onChange={(e) => setTextoLocal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && manejarEnvio()}
      />
      <button
        onClick={manejarEnvio}
        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Send size={14} />
      </button>
    </div>
  );
};

// --- COMPONENTE DE MENSAJE (NODO RECURSIVO) ---
const Nodo = ({ item, depth = 0, user, alResponder, alGestionar, replyId, setReplyId }: any) => (
  <div className={`mt-4 ${depth > 0 ? 'ml-6 border-l-2 border-blue-100 pl-4' : 'border-b pb-6'}`}>
    <div className={`p-4 rounded-xl shadow-sm transition-all ${item.usuarioRole === 'admin' ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-white font-bold ${item.usuarioRole === 'admin' ? 'bg-blue-600' : 'bg-slate-400'}`}>
            {item.usuarioName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-tight">{item.usuarioName}</span>
          {item.usuarioRole === 'admin' && (
            <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
              Pastor
            </span>
          )}
          <span className="text-[9px] text-slate-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>

        {/* BOTONES DE GESTIÓN (Solo Admin) */}
        {user?.role === 'admin' && (
          <div className="flex gap-1">
            {/* Botón Aceptar */}
            <button
              onClick={() => alGestionar(item.id, 'aceptado')}
              className="p-1 text-slate-400 hover:text-green-600 transition-colors"
            >
              <CheckCircle size={14} />
            </button>

            {/* Botón Eliminar */}
            <button
              onClick={() => alGestionar(item.id, 'eliminar')}
              className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-700 leading-relaxed">{item.texto}</p>

      <button
        onClick={() => setReplyId(replyId === item.id ? null : item.id)}
        className="mt-3 flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase hover:text-blue-800 transition-colors"
      >
        <Reply size={12} /> {replyId === item.id ? 'Cancelar' : 'Responder'}
      </button>
    </div>

    {/* INPUT DE RESPUESTA ANIDADA */}
    {replyId === item.id && (
      <div className="mt-3">
        <InputForo
          autoFocus
          placeholder={`Escribe una respuesta a ${item.usuarioName}...`}
          alEnviar={(texto: string) => alResponder(texto, item.id)}
        />
      </div>
    )}

    {/* RESPUESTAS HIJAS */}
    {item.respuestas?.map((r: any) => (
      <Nodo
        key={r.id}
        item={r}
        depth={depth + 1}
        user={user}
        alResponder={alResponder}
        alGestionar={alGestionar}
        replyId={replyId}
        setReplyId={setReplyId}
      />
    ))}
  </div>
);

// --- COMPONENTE PRINCIPAL ---
export default function ForumCounseling() {
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [replyId, setReplyId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user_data');
    if (saved) setUser(JSON.parse(saved));
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const res = await fetch('/api/forum');
      const data = await res.json();
      setComentarios(data);
    } catch (e) {
      console.error("Error cargando foro");
    } finally {
      setCargando(false);
    }
  };

  const enviar = async (contenido: string, parentId: string | null = null) => {
    if (!user) return;

    await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texto: contenido,
        parentId,
        usuarioName: user.name,
        usuarioRole: user.role
      })
    });

    setReplyId(null);
    cargarComentarios();
  };

  const gestionarEstado = async (id: string, accion: 'aceptado' | 'eliminar') => {
    try {
      const url = `/api/foro/${id}`; // Esto debe coincidir con la carpeta [id]

      if (accion === 'eliminar') {
        await fetch(url, { method: 'DELETE' });
      } else {
        await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'aceptado' })
        });
      }
      cargarComentarios(); // Recargar la lista
    } catch (error) {
      console.error("Error gestionando foro", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Nuevo Hilo Principal */}
      <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
          Iniciar nueva consulta de consejería
        </label>
        <InputForo
          placeholder="¿En qué podemos orientarle hoy? Escriba su petición aquí..."
          alEnviar={(texto: string) => enviar(texto, null)}
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-[11px] font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
          <span className="w-8 h-[2px] bg-blue-600"></span>
          Conversaciones activas
        </h4>

        {cargando ? (
          <div className="text-center py-10 text-slate-400 text-xs animate-pulse font-bold">Cargando foro...</div>
        ) : comentarios.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-xs italic font-medium">No hay mensajes aún. ¡Inicia la conversación!</p>
          </div>
        ) : (
          comentarios.map((c) => (
            <Nodo
              key={c.id}
              item={c}
              user={user}
              alResponder={enviar}
              alGestionar={gestionarEstado}
              replyId={replyId}
              setReplyId={setReplyId}
            />
          ))
        )}
      </div>
    </div>
  );
}