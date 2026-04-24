import './globals.css';
import Navbar from '@/components/Navbar';
import {Footer} from '@/components/Footer';
import { BlogProvider } from '@/context/BlogContext';
// Asegúrate de importar el modal que vamos a usar globalmente si es necesario, 
// pero según tu código de Navbar, el modal se maneja allá.
// SI TIENES EL MODAL AQUÍ, BORRALO Y DEJA QUE EL NAVBAR LO MANEJE.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <BlogProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </BlogProvider>
      </body>
    </html>
  );
}