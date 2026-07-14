import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, CreditCard, ChevronRight, Play } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary-500 overflow-x-hidden">
      {/* Floating Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-surface/80 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-black tracking-tight">Angola<span className="text-primary-500">Stay</span></span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-primary-500/20">
                Ir para o Painel
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium hidden sm:block">Entrar</Link>
                <button onClick={() => navigate('/register')} className="bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-full font-bold transition-all">
                  Criar Conta
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax Video */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-[120%] -top-[10%] z-0"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        >
          {/* Fallback color mask */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          {/* Premium Video Background from Pexels (Free to use) */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src="https://videos.pexels.com/video-files/5823150/5823150-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium">A plataforma líder de alojamento em Angola</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000">
            O Padrão de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-600">Ouro</span> <br className="hidden md:block"/>em Alojamento.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            Alugue propriedades exclusivas com garantia antifraude, pague de forma segura via Multicaixa e navegue com inteligência geoespacial.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <button 
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(2,132,199,0.4)] hover:shadow-[0_0_60px_rgba(2,132,199,0.6)] hover:-translate-y-1 flex items-center justify-center group"
            >
              Começar a Explorar
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center text-white font-medium hover:text-primary-400 transition-colors">
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md mr-3 border border-white/20">
                <Play className="w-4 h-4 ml-1" />
              </span>
              Ver Vídeo Demo
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Experiência Sem Atritos</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Construído de raiz para oferecer uma experiência imersiva e segura, tanto para hóspedes como para proprietários exigentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-10 hover:bg-surface transition-colors group">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Garantia Antifraude</h3>
              <p className="text-gray-400 leading-relaxed">
                Todos os proprietários e propriedades são rigorosamente auditados pelos nossos administradores antes de serem listados publicamente.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-10 hover:bg-surface transition-colors group">
              <div className="w-16 h-16 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <CreditCard className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pagamento Imediato</h3>
              <p className="text-gray-400 leading-relaxed">
                Integração nativa com Referências Multicaixa e Cartão de Crédito. A sua reserva é confirmada no segundo exato em que efectua o pagamento.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-surface/50 border border-white/5 rounded-[2.5rem] p-10 hover:bg-surface transition-colors group">
              <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Busca Geoespacial</h3>
              <p className="text-gray-400 leading-relaxed">
                Mova-se por Angola através do nosso mapa interactivo 3D. Descubra alojamentos nos arredores do seu destino em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-surface to-black border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
            Pronto para a sua próxima estadia?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
            Junte-se a milhares de angolanos que já confiam na nossa plataforma para as suas férias e viagens de negócios.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-white text-black hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-lg transition-all shadow-2xl relative z-10"
          >
            Criar Conta Gratuita
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 bg-black py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-black tracking-tight text-white">Angola<span className="text-primary-500">Stay</span></span>
            <p className="text-gray-500 text-sm mt-2">© 2026 AngolaStay. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Ajuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
