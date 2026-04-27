import { Mail, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          
          {/* About Section - Más prominente */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-blue-900/20">
                <img src="/logo-ipuc.webp" alt="Logo IPUC" className="h-10 w-auto object-contain" />
              </div>
              <span className="font-black text-xl text-white tracking-tight uppercase italic">
                Doctrinas <span className="text-blue-500">IPUC</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400/80">
              Dedicados a compartir las verdades bíblicas y las doctrinas fundamentales de la fe apostólica pentecostal bajo una perspectiva académica y espiritual.
            </p>
          </div>

          {/* Quick Links - Estilo corporativo con iconos de flecha */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              {['Inicio', 'Sobre Mí'].map((item) => (
                <li key={item}>
                  <a 
                    href={item === 'Inicio' ? '/' : '/acerca'} 
                    className="flex items-center gap-2 text-sm hover:text-blue-400 hover:translate-x-1 transition-all duration-300"
                  >
                    <ChevronRight className="w-3 h-3 text-blue-500" />
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <a 
                  href="https://ipuc.org.co" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-sm hover:text-blue-400 hover:translate-x-1 transition-all duration-300"
                >
                  <ChevronRight className="w-3 h-3 text-blue-500" />
                  IPUC Nacional
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact - Limpio y organizado */}
          <div className="md:col-span-4 lg:col-span-5">
            <h3 className="font-bold text-white text-sm uppercase tracking-[0.2em] mb-6">Información de Contacto</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email</p>
                  <span className="text-sm text-slate-200">contacto@ejemplo.com</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-blue-500/30 transition-colors">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ubicación</p>
                  <span className="text-sm text-slate-200">Guadalupe, Huila, Colombia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Centrado y elegante */}
        <div className="mt-16 pt-8 border-t border-slate-900">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-medium text-slate-500 tracking-wide">
              © {new Date().getFullYear()} DOCTRINAS IPUC. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <div className="bg-slate-900/80 px-6 py-2 rounded-full border border-slate-800">
              <p className="text-[11px] italic text-blue-400/80 text-center leading-relaxed font-medium">
                "Contendiendo ardientemente por la fe que ha sido una vez dada a los santos" — Judas 1:3
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}