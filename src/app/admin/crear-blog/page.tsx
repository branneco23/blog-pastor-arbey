'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminBlogForm from '@/components/AdminBlogForm';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // 1. Obtener los datos del usuario del LocalStorage
    const storedUser = localStorage.getItem('user_data');
    
    if (!storedUser) {
      router.push('/'); // Si no hay usuario, fuera al inicio
      return;
    }

    const user = JSON.parse(storedUser);

    // 2. Si NO es admin, redirigir al inicio
    if (user.role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Crear Nuevo Blog</h1>
        <AdminBlogForm />
      </div>
    </div>
  );
}