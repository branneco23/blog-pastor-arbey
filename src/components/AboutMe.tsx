'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Mic2,
  Users2,
  Video,
  MessagesSquare,
  CheckCircle2,
  X,
  Send
} from 'lucide-react';

export default function AboutMe() {
  // Estados para el Pop-up y envío
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      subject: formData.get('subject'),
      description: formData.get('description'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        alert('Mensaje enviado exitosamente. El Pastor se pondrá en contacto pronto.');
        setIsModalOpen(false);
      } else {
        alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error de conexión.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="pb-20 relative">
      {/* SECCIÓN HERO - ENFOQUE PASTORAL */}
      <section className="bg-blue-600 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="bg-blue-500/30 text-blue-100 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest mb-4 inline-block">
            Ministerio de Enseñanza
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Forjando una Nueva Generación
          </h1>
          <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto italic">
            "Orientación familiar y consejería pastoral fundamentada en la sana doctrina de la Palabra de Dios."
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        
        {/* CARDS DE SERVICIOS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <ServiceHighlight 
            icon={<MessagesSquare size={32} />}
            title="Consejería Pastoral"
            desc="Acompañamiento espiritual y apoyo en momentos de dificultad."
          />
          <ServiceHighlight 
            icon={<Users2 size={32} />}
            title="Orientación Familiar"
            desc="Fortaleciendo los hogares bajo los principios bíblicos apostólicos."
          />
          <ServiceHighlight 
            icon={<BookOpen size={32} />}
            title="Estudios Bíblicos"
            desc="Profundización en la doctrina y las Sagradas Escrituras."
          />
        </div>

        {/* NUESTRA MISIÓN Y VISIÓN DE FORMADORES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-28">
          <div className="rounded-[40px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1475483768296-6163e08872a1?q=80&w=2070&auto=format&fit=crop" 
              alt="Formación de nueva generación" 
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
              Somos Formadores de una <span className="text-blue-600">Nueva Generación</span>
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Dios le bendiga. Nuestro ministerio está dedicado a la enseñanza clara de la <strong>doctrina apostólica</strong>, enfocándonos en ser forjadores de hombres y mujeres comprometidos con el Reino de Dios.
              </p>
              <p>
                Creemos en la importancia de la familia como base de la sociedad, por ello, brindamos herramientas de orientación y consejería para guiar a cada hogar por el camino de la verdad.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="text-blue-600" size={20} /> Música Cristiana
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="text-blue-600" size={20} /> Videos de Edificación
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PILARES DEL MINISTERIO */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Nuestros Pilares</h2>
            <p className="text-slate-500">Recursos diseñados para tu crecimiento espiritual</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValorCard 
              icon={<ShieldCheck className="text-blue-600" />} 
              title="Doctrina Apostólica" 
              desc="Enseñanzas firmes basadas en Hechos 2:38 y la unicidad de Dios."
            />
            <ValorCard 
              icon={<Mic2 className="text-blue-600" />} 
              title="Radio Virtual" 
              desc="Sintoniza nuestra palabra y alabanzas en vivo 24/7."
            />
            <ValorCard 
              icon={<Video className="text-blue-600" />} 
              title="Multimedia" 
              desc="Accede a los videos y mensajes para fortalecer tu fe en casa."
            />
            <ValorCard 
              icon={<Heart className="text-blue-600" />} 
              title="Apoyo Familiar" 
              desc="Consejería personalizada para matrimonios, jóvenes y padres."
            />
          </div>
        </section>

        {/* BANNER DE CONTACTO */}
        <div className="bg-slate-900 rounded-[48px] p-12 text-center text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10 pointer-events-none"></div>
            <h3 className="text-3xl font-black mb-4 relative z-10">¿Necesitas orientación o consejería?</h3>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10">
                Estamos aquí para escucharte y orar por ti. No dudes en contactarnos para agendar una cita de consejería o resolver dudas doctrinales.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-colors shadow-xl relative z-10"
            >
                Escribir al Pastor
            </button>
        </div>
      </div>

      {/* POP-UP / MODAL DE FORMULARIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
            {/* Botón Cerrar */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={28} />
            </button>

            <div className="mb-8">
              <h3 className="text-3xl font-black text-slate-900 mb-2">Solicitar Orientación</h3>
              <p className="text-slate-500">Sus datos y mensajes serán tratados con total reserva pastoral.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                <input 
                  required 
                  name="name" 
                  type="text" 
                  placeholder="Tu nombre"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Asunto de la consulta</label>
                <input 
                  required 
                  name="subject" 
                  type="text" 
                  placeholder="Ej: Orientación Familiar / Duda Doctrinal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Descripción</label>
                <textarea 
                  required 
                  name="description" 
                  rows={4} 
                  placeholder="Escribe aquí brevemente tu necesidad..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button 
                disabled={isSending}
                type="submit" 
                className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send size={20} />
                    Enviar al Pastor
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceHighlight({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-blue-900/5 border border-slate-50 text-center">
      <div className="text-blue-600 flex justify-center mb-4">{icon}</div>
      <h4 className="text-xl font-black text-slate-900 mb-2">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ValorCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-slate-50 p-8 rounded-[32px] border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-300">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h4 className="font-black text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}