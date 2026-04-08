import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Pastor Arbey",
  description: "Mensajes de fe y esperanza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}