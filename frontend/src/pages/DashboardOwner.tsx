import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import { LogOut, Home, Plus, FileText, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  name: string;
  status: string;
  province: string;
  municipality: string;
  price_per_night: number;
}

export default function DashboardOwner() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await api.get('/my-properties');
        setProperties(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <nav className="bg-surface/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-primary-500 mr-2" />
              <span className="text-xl font-bold text-white tracking-tight">AngolaStay <span className="text-primary-500">Owner</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Olá, {user?.name}</span>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Minhas Propriedades</h1>
          <button className="bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl py-2 px-4 transition-all hover:shadow-[0_0_20px_rgba(2,132,199,0.4)] flex items-center">
            <Plus className="w-5 h-5 mr-1" />
            Nova Propriedade
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-surface border border-white/10 rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma propriedade cadastrada</h3>
            <p className="text-gray-400 mb-6">Ainda não tem propriedades na plataforma. Comece por adicionar o seu primeiro alojamento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div key={property.id} className="bg-surface border border-white/10 hover:border-primary-500/30 rounded-2xl overflow-hidden transition-colors group">
                <div className="h-48 bg-black/50 relative">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">Sem Imagem</div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-md ${
                      property.status === 'approved' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      property.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {property.status === 'approved' ? 'Aprovado' : property.status === 'rejected' ? 'Rejeitado' : 'Em Análise'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{property.name}</h3>
                  <div className="flex items-center text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.municipality}, {property.province}
                  </div>
                  <div className="flex items-center text-primary-400 font-medium">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {property.price_per_night} Kz <span className="text-gray-500 font-normal ml-1">/ noite</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
