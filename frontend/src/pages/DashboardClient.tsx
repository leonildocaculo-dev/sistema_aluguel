import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import { LogOut, Search, MapPin, Calendar, Users, Loader2, Star, Map as MapIcon, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapSearch from '../components/MapSearch';

interface Property {
  id: number;
  name: string;
  province: string;
  municipality: string;
  price_per_night: number;
  accommodations: { id: number; capacity: number }[];
  images: { path: string }[];
}

export default function DashboardClient() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const [filters, setFilters] = useState({
    province: '',
    municipality: '',
    check_in: '',
    check_out: '',
    capacity: '',
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams();
      if (filters.province) params.append('province', filters.province);
      if (filters.municipality) params.append('municipality', filters.municipality);
      if (filters.check_in) params.append('check_in', filters.check_in);
      if (filters.check_out) params.append('check_out', filters.check_out);
      if (filters.capacity) params.append('capacity', filters.capacity);

      const response = await api.get(`/search?${params.toString()}`);
      setProperties(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-primary-900/40 to-background z-0"></div>

      {/* Top Navbar */}
      <nav className="relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center border-b border-white/10">
            <div className="flex items-center">
              <span className="text-2xl font-black text-white tracking-tight">Angola<span className="text-primary-500">Stay</span></span>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => navigate('/my-reservations')} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Minhas Reservas
              </button>
              <div className="h-4 w-px bg-white/20"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold border border-primary-500/30">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Sair">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Search Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Descubra o Alojamento Perfeito em Angola
          </h1>
          <p className="text-lg text-gray-400">
            Desde resorts de luxo em Luanda a lodges pacíficos no Namibe. Reserve com garantia antifraude.
          </p>
        </div>

        {/* Search Bar (Glassmorphism) */}
        <div className="bg-surface/60 backdrop-blur-2xl border border-white/10 p-4 sm:p-6 rounded-3xl shadow-2xl mx-auto max-w-5xl mb-16">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Província (ex: Luanda)" 
                value={filters.province}
                onChange={e => setFilters({...filters, province: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:contents">
              <div className="md:w-48 relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="date" 
                  value={filters.check_in}
                  onChange={e => setFilters({...filters, check_in: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-10 pr-2 text-white focus:ring-2 focus:ring-primary-500/50 outline-none transition-all text-sm sm:text-base"
                />
              </div>
              <div className="md:w-48 relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="date" 
                  value={filters.check_out}
                  onChange={e => setFilters({...filters, check_out: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-10 pr-2 text-white focus:ring-2 focus:ring-primary-500/50 outline-none transition-all text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="md:w-32 relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="number" 
                min="1"
                placeholder="Hóspedes" 
                value={filters.capacity}
                onChange={e => setFilters({...filters, capacity: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl px-8 py-4 flex items-center justify-center transition-all hover:shadow-[0_0_30px_rgba(2,132,199,0.5)] group"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {viewMode === 'list' ? `${properties.length} Alojamentos Encontrados` : 'Pesquisa Interativa'}
              </h2>
              
              <div className="flex bg-surface/80 border border-white/10 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-bold transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg flex items-center text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <MapIcon className="w-4 h-4 mr-2" />
                  Mapa
                </button>
              </div>
            </div>
            
            {viewMode === 'map' ? (
              <div className="animate-in fade-in duration-700">
                <MapSearch />
              </div>
            ) : (
              <>
                {properties.length === 0 && !loading ? (
                  <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5">
                    <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-white font-medium">Nenhum resultado</h3>
                    <p className="text-gray-400">Tente ajustar as suas datas ou localização.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.map(property => (
                      <div key={property.id} onClick={() => navigate(`/property/${property.id}`)} className="bg-surface/40 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:border-primary-500/50 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-900/20">
                        <div className="h-56 relative overflow-hidden">
                          {property.images && property.images.length > 0 ? (
                            <img src={property.images[0].path} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">Sem Foto</div>
                          )}
                          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center border border-white/10">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-bold text-white">4.9</span>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="text-xs font-semibold tracking-wider text-primary-400 uppercase mb-1">
                            {property.municipality}, {property.province}
                          </div>
                          <h3 className="text-lg font-bold text-white mb-1 truncate">{property.name}</h3>
                          <div className="mt-4 flex items-end justify-between">
                            <div>
                              <span className="text-xl font-bold text-white">{property.price_per_night} Kz</span>
                              <span className="text-gray-400 text-sm ml-1">/ noite</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
