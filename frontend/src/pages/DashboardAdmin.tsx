import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { api } from '../services/api';
import { LogOut, ShieldCheck, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  name: string;
  status: string;
  owner: { name: string };
}

interface Payment {
  id: number;
  reservation_id: number;
  valor: number;
  metodo: string;
  comprovativo_path: string;
  estado: string;
  reservation: { id: number; accommodation: { property: { name: string } }; user: { name: string } };
}

export function DashboardAdmin() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'properties' | 'payments'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'properties') loadProperties();
    else loadPayments();
  }, [activeTab]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/properties');
      setProperties(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/payments/pending');
      setPayments(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/admin/payments/${id}/${action}`);
      loadPayments();
    } catch (error) {
      console.error(error);
      alert('Erro ao processar pagamento.');
    }
  };

  const handleStatusChange = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.post(`/admin/properties/${id}/${action}`);
      loadProperties(); // Reload list
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar estado.');
    }
  };

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
              <ShieldCheck className="h-8 w-8 text-primary-500 mr-2" />
              <span className="text-xl font-bold text-white tracking-tight">AngolaStay <span className="text-primary-500">Admin</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Admin: {user?.name}</span>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex space-x-4 border-b border-white/10 pb-4">
          <button 
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'properties' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Validação de Propriedades
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'payments' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            Validação de Pagamentos
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : activeTab === 'properties' ? (
          <div className="bg-surface border border-white/10 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/20 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-gray-300">ID</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Propriedade</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Proprietário</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Estado</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {properties.map(property => (
                  <tr key={property.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm text-gray-400">#{property.id}</td>
                    <td className="p-4 text-sm font-medium text-white">{property.name}</td>
                    <td className="p-4 text-sm text-gray-400">{property.owner?.name}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        property.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                        property.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {property.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end space-x-2">
                      {property.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(property.id, 'approve')} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors" title="Aprovar">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleStatusChange(property.id, 'reject')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Rejeitar">
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Sem propriedades para validar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-surface border border-white/10 rounded-2xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-black/20 border-b border-white/10">
                  <th className="p-4 text-sm font-semibold text-gray-300">Reserva</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Cliente</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Valor</th>
                  <th className="p-4 text-sm font-semibold text-gray-300">Comprovativo</th>
                  <th className="p-4 text-sm font-semibold text-gray-300 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm text-white">#{payment.reservation_id} - {payment.reservation?.accommodation?.property?.name}</td>
                    <td className="p-4 text-sm text-gray-400">{payment.reservation?.user?.name}</td>
                    <td className="p-4 text-sm font-bold text-white">{payment.valor} Kz</td>
                    <td className="p-4">
                      <a href={payment.comprovativo_path} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 underline text-sm">
                        Ver Ficheiro
                      </a>
                    </td>
                    <td className="p-4 flex justify-end space-x-2">
                      <button onClick={() => handlePaymentAction(payment.id, 'approve')} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors" title="Confirmar Pagamento">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => handlePaymentAction(payment.id, 'reject')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Rejeitar Falso/Inválido">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Sem pagamentos para validar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
