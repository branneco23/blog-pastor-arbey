'use client';
import AdminBlogForm from '@/components/AdminBlogForm'; // Asegúrate de que el formulario esté en la misma carpeta

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-10">
      <AdminBlogForm />
    </main>
  );
}