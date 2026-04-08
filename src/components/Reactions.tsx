'use client';
import { useState } from 'react';

export default function Reactions({ blogId, initialReactions }: any) {
  const [reactions, setReactions] = useState(initialReactions);

  const handleReact = async (type: string) => {
    // Optimistic UI: actualizamos antes de la respuesta
    setReactions({ ...reactions, [type]: reactions[type] + 1 });
    
    await fetch(`/api/blogs/${blogId}/react`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  };

  return (
    <div className="flex gap-4 mt-4">
      <button 
        onClick={() => handleReact('amen')}
        className="px-4 py-2 border rounded-full hover:bg-blue-50 transition flex items-center gap-2"
      >
        🙏 Amén <span className="font-bold">{reactions.amen}</span>
      </button>
      <button 
        onClick={() => handleReact('gracias')}
        className="px-4 py-2 border rounded-full hover:bg-orange-50 transition flex items-center gap-2"
      >
        🙌 Gracias <span className="font-bold">{reactions.gracias}</span>
      </button>
    </div>
  );
}