'use client';
import { useState } from 'react';

export default function BlogCard({ post }: { post: any }) {
  const [reactions, setReactions] = useState(post.reactions);

  const handleReact = async (type: 'amen' | 'gracias') => {
    // UI Optimista
    setReactions({ ...reactions, [type]: reactions[type] + 1 });

    await fetch(`/api/posts/${post._id}/react`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <span className="text-blue-600 text-xs font-bold uppercase">{post.category}</span>
        <h3 className="text-xl font-bold mt-1">{post.title}</h3>
        <p className="text-slate-500 text-sm mt-2 line-clamp-2">{post.content}</p>
        
        <div className="flex gap-4 mt-6 pt-4 border-t">
          <button 
            onClick={() => handleReact('amen')}
            className="flex items-center gap-1 text-sm hover:scale-110 transition"
          >
            🙏 <span className="font-bold text-slate-700">{reactions.amen}</span>
          </button>
          <button 
            onClick={() => handleReact('gracias')}
            className="flex items-center gap-1 text-sm hover:scale-110 transition"
          >
            🙌 <span className="font-bold text-slate-700">{reactions.gracias}</span>
          </button>
        </div>
      </div>
    </div>
  );
}