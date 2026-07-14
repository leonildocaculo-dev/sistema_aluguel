import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { LogIn, KeyRound, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'A password é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      // Pedido csrf sanctum para inicializar cookies, só necessário se usar stateful SPA auth, mas estamos usando tokens explicitos
      const response = await api.post('/login', data);
      setAuth(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      alert("Credenciais incorretas.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs for premium aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-500/10 mb-4 ring-1 ring-primary-500/30">
              <LogIn className="w-8 h-8 text-primary-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-400">Entre na sua conta AngolaStay para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm ml-1 mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-sm ml-1 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl py-3 px-4 transition-all hover:shadow-[0_0_20px_rgba(2,132,199,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  A entrar...
                </>
              ) : (
                'Entrar na Plataforma'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Ainda não tem conta?{' '}
            <a href="/register" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              Registe-se como Cliente ou Proprietário
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
