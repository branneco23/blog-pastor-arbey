import { Mail, MapPin } from "lucide-react";
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-ipuc" alt="Logo IPUC" className="h-10 w-auto object-contain" />
              <span className="font-bold text-white">Doctrinas IPUC</span>
            </div>
            <p className="text-sm">
              Compartiendo las verdades bíblicas y doctrinas fundamentales de la fe apostólica pentecostal.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/acerca" className="hover:text-blue-400 transition-colors">
                  Acerca de Nosotros
                </a>
              </li>
              <li>
                <a href="https://ipuc.org.co" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  IPUC Nacional
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>contacto@ejemplo.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Doctrinas IPUC. Todos los derechos reservados.</p>
          <p className="mt-2 text-slate-400">
            "Contendiendo ardientemente por la fe que ha sido una vez dada a los santos" - Judas 1:3
          </p>
        </div>
      </div>
    </footer>
  );
}