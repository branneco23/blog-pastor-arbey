'use client';

import { 
  BookOpen, 
  Heart, 
  Users, 
  ShieldCheck, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react';

export default function AboutMe() {
  return (
    <div className="pb-20">
      {/* SECCIÓN HERO - ACERCA DE NOSOTROS */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Acerca de Nosotros</h1>
          <p className="text-xl text-blue-100 font-medium italic">
            "Compartiendo las verdades apostólicas de la Palabra de Dios"
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 mt-16">
        {/* NUESTRA MISIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6">Nuestra Misión</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p>
                Este blog ha sido creado con el propósito de compartir y enseñar las doctrinas fundamentales de la <strong>fe apostólica pentecostal</strong>, tal como son practicadas y enseñadas en la Iglesia Pentecostal Unida de Colombia (IPUC).
              </p>
              <p>
                Nuestro objetivo es presentar las verdades bíblicas de manera clara, accesible y fundamentada en las Sagradas Escrituras, ayudando a creyentes y buscadores a entender y profundizar en su fe.
              </p>
            </div>
          </div>
          <div className="rounded-[32px] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop" 
              alt="Estudio Bíblico" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* NUESTROS VALORES */}
        <section className="mb-24 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValorCard 
              icon={<BookOpen className="text-blue-600" />} 
              title="Fidelidad Bíblica" 
              desc="Basamos todas nuestras enseñanzas en la autoridad de las Sagradas Escrituras, la Palabra de Dios inspirada e inerrante."
            />
            <ValorCard 
              icon={<Heart className="text-blue-600" />} 
              title="Amor y Verdad" 
              desc="Compartimos la verdad con amor, buscando edificar y fortalecer la fe de cada persona que lee nuestro contenido."
            />
            <ValorCard 
              icon={<Users className="text-blue-600" />} 
              title="Comunidad" 
              desc="Fomentamos la unidad del cuerpo de Cristo y promovemos la comunión entre los creyentes de la fe apostólica."
            />
            <ValorCard 
              icon={<ShieldCheck className="text-blue-600" />} 
              title="Claridad Doctrinal" 
              desc="Presentamos las doctrinas de manera clara y comprensible, facilitando el estudio y la comprensión de las verdades bíblicas."
            />
          </div>
        </section>

        {/* SOBRE LA IPUC */}
        <div className="bg-slate-50 rounded-[40px] p-10 md:p-16 mb-20 border border-slate-100">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Sobre la Iglesia Pentecostal Unida de Colombia</h2>
          <p className="text-slate-600 text-lg mb-10 leading-relaxed">
            La Iglesia Pentecostal Unida de Colombia (IPUC) es una organización religiosa pentecostal que predica y enseña la doctrina apostólica, basada en la experiencia del día de Pentecostés registrada en <strong>Hechos 2:38</strong>.
          </p>
          <div className="space-y-6">
            <Pilar title="Arrepentimiento" desc="Un cambio genuino de corazón y abandono del pecado." />
            <Pilar title="Bautismo en el nombre de Jesús" desc="Por inmersión para el perdón de los pecados." />
            <Pilar title="El don del Espíritu Santo" desc="Con la evidencia de hablar en otras lenguas." />
          </div>
        </div>

        {/* FOOTER ESPIRITUAL */}
        <div className="text-center pt-10 border-t border-slate-100">
          <h3 className="text-2xl font-black text-slate-900 mb-8 italic">
            "Contendiendo ardientemente por la fe que ha sido una vez dada a los santos"
            <span className="block text-sm text-slate-400 mt-2 font-normal">— Judas 1:3</span>
          </h3>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-100 flex items-center gap-2 mx-auto">
            Contáctanos
          </button>
        </div>
      </div>
    </div>
  );
}

function ValorCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
        {icon}
      </div>
      <h4 className="font-black text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Pilar({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <CheckCircle2 className="text-blue-600 mt-1 shrink-0" size={24} />
      <p className="text-slate-700 text-lg">
        <span className="font-black text-blue-900">{title}:</span> {desc}
      </p>
    </div>
  );
}