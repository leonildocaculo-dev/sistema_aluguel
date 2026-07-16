"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface KycVerification {
  id: number;
  user: { id: number; name: string; email: string };
  document_type: string;
  document_path: string;
  status: string;
}

export function AdminDashboardClient() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'properties' | 'payments' | 'kyc' | 'logs'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [kycs, setKycs] = useState<KycVerification[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin (role_id 1 is typically Admin, depending on setup)
    if (user && user.role_id !== 1) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (activeTab === 'properties') loadProperties();
    else if (activeTab === 'payments') loadPayments();
    else if (activeTab === 'kyc') loadKycs();
    else loadLogs();
  }, [activeTab]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/logs');
      setLogs(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const loadKycs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/kyc/pending');
      setKycs(response.data.data);
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
      loadProperties(); 
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar estado.');
    }
  };

  const handleKycAction = async (id: number, action: 'approve' | 'reject') => {
    try {
      let data = {};
      if (action === 'reject') {
        const notes = prompt('Insira o motivo da rejeição (será enviado por email):');
        if (!notes) return; // User cancelled
        data = { admin_notes: notes };
      }
      await api.post(`/admin/kyc/${id}/${action}`, data);
      loadKycs();
    } catch (error) {
      console.error(error);
      alert('Erro ao processar KYC.');
    }
  };

  if (user?.role_id !== 1) return null; // Avoid rendering flash before redirect

  return (
    <div className="container mx-auto max-w-[var(--container-width)] py-10 px-4">
      <div className="mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-4">
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
        <button 
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'kyc' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Validação de KYC (Proprietários)
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'logs' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          Auditoria & Logs (LPDP)
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
      ) : activeTab === 'payments' ? (
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
      ) : activeTab === 'kyc' ? (
        <div className="bg-surface border border-white/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/20 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-gray-300">ID Proprietário</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Nome / Email</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Tipo Documento</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Ficheiro</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {kycs.map(kyc => (
                <tr key={kyc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm text-gray-400">#{kyc.user.id}</td>
                  <td className="p-4 text-sm text-white">
                    <div className="font-medium">{kyc.user.name}</div>
                    <div className="text-gray-500 text-xs">{kyc.user.email}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-white">
                    {kyc.document_type === 'id_card' ? 'Bilhete de Identidade' : 'Passaporte'}
                  </td>
                  <td className="p-4">
                    <a href={kyc.document_path} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 underline text-sm">
                      Ver Documento
                    </a>
                  </td>
                  <td className="p-4 flex justify-end space-x-2">
                    <button onClick={() => handleKycAction(kyc.id, 'approve')} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors" title="Aprovar">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleKycAction(kyc.id, 'reject')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Rejeitar">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {kycs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Nenhum documento KYC pendente para validação.</td>
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
                <th className="p-4 text-sm font-semibold text-gray-300">Data</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Utilizador / IP</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Ação</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Módulo (ID)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('pt-AO')}
                  </td>
                  <td className="p-4 text-sm text-white">
                    <div className="font-medium">{log.user?.name || 'Sistema/Anónimo'}</div>
                    <div className="text-gray-500 text-xs">{log.ip_address}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400">
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    <div className="font-medium text-gray-300">
                      {log.model_type?.split('\\').pop() || 'N/A'}
                    </div>
                    <div className="text-xs">ID: {log.model_id || 'N/A'}</div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">Nenhum registo de auditoria encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
