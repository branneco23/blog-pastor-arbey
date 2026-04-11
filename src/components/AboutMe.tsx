import { Book, Heart, Users, ShieldCheck } from 'lucide-react';

export default function AcercaPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Azul */}
      <section className="bg-blue-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Acerca de Nosotros</h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">
          Compartiendo las verdades apostólicas de la Palabra de Dios.
        </p>
      </section>

      {/* Sección Misión */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-6">Nuestra Misión</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
            <p>
              Este blog ha sido creado con el propósito de compartir y enseñar las doctrinas fundamentales de la fe apostólica pentecostal...
            </p>
            <p>
              Nuestro objetivo es presentar las verdades bíblicas de manera clara, accesible y fundamentada en las Sagradas Escrituras...
            </p>
          </div>
        </div>
        <div className="relative h-80 rounded-[32px] overflow-hidden shadow-2xl">
          <img 
            src="/images/biblia-abierta.jpg" 
            alt="Nuestra Misión" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Sección Valores - Cuadrícula */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Nuestros Valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValorCard 
              icon={<Book className="text-blue-600" />} 
              title="Fidelidad Bíblica" 
              desc="Basamos todas nuestras enseñanzas en la autoridad de las Sagradas Escrituras." 
            />
            <ValorCard 
              icon={<Heart className="text-blue-600" />} 
              title="Amor y Verdad" 
              desc="Compartimos la verdad con amor, buscando edificar y fortalecer la fe." 
            />
            <ValorCard 
              icon={<Users className="text-blue-600" />} 
              title="Comunidad" 
              desc="Fomentamos la unidad del cuerpo de Cristo y promovemos la comunión." 
            />
            <ValorCard 
              icon={<ShieldCheck className="text-blue-600" />} 
              title="Claridad Doctrinal" 
              desc="Presentamos las doctrinas de manera clara y comprensible." 
            />
          </div>
        </div>
      </section>

      {/* Sección IPUC - Banner Celeste */}
      <section className="max-w-5xl mx-auto my-20 px-6">
        <div className="bg-blue-50 border border-blue-100 rounded-[40px] p-10 md:p-16 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">Sobre la Iglesia Pentecostal Unida de Colombia</h2>
          <p className="text-slate-600 mb-8 font-medium">
            La IPUC es una organización religiosa pentecostal que predica y enseña la doctrina apostólica...
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
            <li className="text-slate-700 font-bold text-sm list-none">• Arrepentimiento</li>
            <li className="text-slate-700 font-bold text-sm list-none">• Bautismo en el nombre de Jesús</li>
            <li className="text-slate-700 font-bold text-sm list-none">• Don del Espíritu Santo</li>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-20">
        <h3 className="text-2xl font-black text-slate-900 mb-6 font-serif italic">"Contendiendo ardientemente por la fe..."</h3>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-100">
          Contáctanos
        </button>
      </section>
    </main>
  );
}

function ValorCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all duration-300">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="font-black text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}