import './globals.css';
import Navbar from '@/components/Navbar'; // Verifica que la ruta sea correcta

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body className="antialiased bg-slate-50 text-slate-900 overflow-x-hidden relative">
        {/* El Navbar solo se declara una vez aquí */}
        <Navbar />
        
        {/* w-full y overflow-hidden aseguran que el contenido no empuje hacia los lados */}
        <main className="min-h-screen w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}