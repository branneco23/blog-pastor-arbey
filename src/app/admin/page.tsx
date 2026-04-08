'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [form, setForm] = useState({ title: '', content: '', image: '', category: 'Reflexión' });

  const savePost = async () => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert('¡Mensaje publicado con éxito!');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold mb-2">Título del Mensaje</label>
          <input 
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({...form, title: e.target.value})} 
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Contenido (Palabra)</label>
          <textarea 
            rows={6}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setForm({...form, content: e.target.value})} 
          />
        </div>
        <button 
          onClick={savePost}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition"
        >
          Publicar Mensaje Dominical
        </button>
      </div>
    </div>
  );
}