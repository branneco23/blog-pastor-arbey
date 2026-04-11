// src/app/layout.tsx
import Navbar from '@/components/Navbar';
import RadioFloating from '@/components/RadioFloating'; // Importa el nuevo componente
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-sans">
        <Navbar />
        {children}
        <RadioFloating /> {/* Esto lo pone por encima de todo */}
      </body>
    </html>
  );
}