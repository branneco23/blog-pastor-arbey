'use client';
import { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Dentro de tu AuthModal.tsx, en la parte donde el login es exitoso:
      // Dentro de handleSubmit en AuthModal.tsx
      if (response.ok) {
        if (isLogin) {
          // Guardamos para el Navbar
          localStorage.setItem('user_data', JSON.stringify({
            name: data.name,
            role: data.role
          }));

          window.dispatchEvent(new Event('storage'));
          onClose();

          if (data.role === 'admin') {
            // Usamos window.location.href en lugar de router.push 
            // para asegurar que el navegador envíe la nueva cookie al servidor
            window.location.href = '/admin/blogs';
          } else {
            window.location.href = '/';
          }
        }
      } else {
        alert(data.error || "Ocurrió un error en la autenticación");
      }
    } catch (err) {
      alert("Error de conexión. Revisa tu internet e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear el formulario al cambiar entre Login/Registro
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative border border-white/20">

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <div className="p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isLogin ? '¡Bienvenido!' : 'Crea tu cuenta'}
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-medium">
              {isLogin ? 'Ingresa para gestionar las enseñanzas' : 'Regístrate para participar en la comunidad'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Tu contraseña"
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Cargando...</span>
                </>
              ) : (
                <span>{isLogin ? 'INICIAR SESIÓN' : 'REGISTRARME'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? '¿No tienes una cuenta aún?' : '¿Ya eres parte de nosotros?'}
              <button
                type="button"
                onClick={toggleAuthMode}
                className="ml-2 text-blue-600 font-bold hover:underline"
              >
                {isLogin ? 'Crea una aquí' : 'Entra aquí'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}