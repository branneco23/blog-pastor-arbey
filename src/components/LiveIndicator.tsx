'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Radio } from 'lucide-react';

export default function LiveIndicator() {
  const [live, setLive] = useState<any>(null);

  useEffect(() => {
    const checkLive = () => {
      fetch('/api/admin/live').then(res => res.json()).then(data => {
        if (data.isLive) setLive(data);
        else setLive(null);
      });
    };
    checkLive();
    const interval = setInterval(checkLive, 60000); // Checa cada minuto
    return () => clearInterval(interval);
  }, []);

  if (!live) return null;

  return (
    <Link href="/envivo" className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform animate-bounce">
      <Radio size={20} className="animate-pulse" />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold uppercase opacity-80">Estamos</span>
        <span className="font-black text-sm">EN VIVO</span>
      </div>
    </Link>
  );
}