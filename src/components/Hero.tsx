'use client';
import Image from 'next/image';
import { BookOpen, Users, Radio, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-blue-600 relative overflow-hidden w-full border-b border-blue-700/50">
      
      {/* Luces de fondo decorativas extendidas para cubrir el nuevo ancho */}
      <div className="absolute top-0 right-0 w-[1000px] h-[800px] bg-blue-500 rounded-full blur-[180px] opacity-30 -mr-64 -mt-40"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-700 rounded-full blur-[150px] opacity-20 -ml-32 -mb-32"></div>
      
      {/* AJUSTES HORIZONTALES PRINCIPALES:
         1. max-w-[1700px]: Aumentamos el ancho máximo del contenido.
         2. md:px-16: Más padding lateral para que respire en pantallas grandes.
         3. justify-between: Empuja la imagen a la izquierda y el texto a la derecha.
         4. lg:gap-20: Aumenta la separación entre los dos bloques.
      */}
      <div className="max-w-[1700px] mx-auto px-6 md:px-16 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
        
        {/* CONTENEDOR DE IMAGEN */}
        <div className="shrink-0 flex justify-center md:justify-start order-2 md:order-1">
          <div className="bg-blue-800/30 p-3 md:p-4 rounded-[40px] backdrop-blur-sm shadow-2xl border border-white/10 w-fit">
            <div className="overflow-hidden rounded-[30px] bg-slate-200 relative w-[280px] sm:w-[350px] lg:w-[420px] aspect-[9/14]">
              <Image 
                src="/pastor-arbey.png" 
                alt="Pastor Arbey Bustamante - Toma Completa" 
                fill
                priority
                className="object-contain object-bottom hover:scale-105 transition duration-700 ease-in-out"
                sizes="(max-width: 768px) 280px, 420px"
              />
            </div>
          </div>
        </div>

        {/* CONTENIDO DE TEXTO 
           Mantenemos max-w-2xl para que las líneas de texto no se vuelvan ilegibles,
           pero el bloque entero se mueve a la derecha gracias a 'justify-between' del padre.
        */}
        <div className="text-white text-center md:text-left flex flex-col justify-center max-w-4xl order-1 md:order-2 flex-1">
          
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
            <span className="inline-flex items-center gap-2 bg-blue-900/50 text-blue-200 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-400/20">
              <Radio size={14} className="text-red-500 animate-pulse" />
              En Vivo
            </span>
            <span className="inline-flex items-center gap-2 bg-blue-900/50 text-blue-200 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-400/20">
              <MapPin size={14} className="text-blue-400" />
              Guadalupe, Huila
            </span>
          </div>

          {/* Mismos tamaños de fuente, solo ajustamos los cortes de línea */}
          <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black leading-[0.95] tracking-tighter uppercase italic mb-8">
            Predicamos lo <br className="hidden lg:block" />
            que la palabra <br className="hidden lg:block" />
            <span className="text-blue-300">de Dios enseña</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-blue-100 font-medium leading-relaxed mb-10 opacity-90 max-w-xl mx-auto md:mx-0">
            Verdades fundamentales de la fe pentecostal basados en las Sagradas Escrituras.
          </p>

          {/* ACCIONES */}
          <div className="flex flex-wrap gap-5 justify-center md:justify-start pt-2">
            <button className="group bg-white text-blue-700 px-10 py-4 rounded-2xl font-black shadow-2xl hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-tight text-base">
              <BookOpen size={22} className="group-hover:rotate-6 transition-transform" />
              Ver Doctrinas
            </button>
            
            <button className="group bg-blue-700/40 border border-blue-400/30 text-white px-10 py-4 rounded-2xl font-black backdrop-blur-md hover:bg-blue-800/60 transition-all active:scale-95 flex items-center gap-3 uppercase tracking-tight text-base">
              <Users size={22} className="group-hover:scale-110 transition-transform" />
              Nosotros
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}