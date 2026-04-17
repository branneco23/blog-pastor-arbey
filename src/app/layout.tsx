import { Footer } from '@/components/Footer';
import './globals.css';
import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <body className="antialiased bg-slate-50 text-slate-900 overflow-x-hidden relative">
        <Navbar />
        <main className="min-h-screen w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}