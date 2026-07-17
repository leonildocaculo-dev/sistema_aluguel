"use client";

import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';
import { useRouter } from 'next/navigation';
import { User, ShieldAlert, ArrowLeft, Loader2, Save } from 'lucide-react';

export function ProfileClient() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/profile', formData);
      setUser(response.data.user);
      alert('Perfil atualizado com sucesso.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm("ATENÇÃO: Deseja mesmo desativar a sua conta? Perderá o acesso permanentemente.")) {
      try {
        const response = await api.post('/profile/deactivate');
        alert(response.data.message);
        logout();
        router.push('/');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Erro ao desativar conta.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <button onClick={() => router.push('/')} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
        </button>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil e Privacidade</h1>
          <p className="text-gray-400 text-sm">Faça a gestão dos seus dados pessoais e privacidade.</p>
        </div>

        <div className="bg-surface/50 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white flex items-center mb-6">
            <User className="w-5 h-5 mr-2 text-primary-500" />
            Dados Pessoais
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telemóvel</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-primary-500 outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-500 text-white font-medium px-6 py-2.5 rounded-lg flex items-center transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                Guardar Alterações
              </button>
            </div>
          </form>
        </div>

        {/* Zona de Perigo */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-red-500 flex items-center mb-2">
            <ShieldAlert className="w-5 h-5 mr-2" />
            Zona de Perigo
          </h2>
          <p className="text-red-400/80 text-sm mb-6">
            Ao desativar a sua conta, os seus dados deixarão de estar visíveis e perderá permanentemente o acesso ao sistema. O seu e-mail e telefone permanecerão bloqueados no sistema por razões de auditoria e segurança.
          </p>
          <button 
            onClick={handleDeactivate}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Desativar Conta
          </button>
        </div>

      </div>
    </div>
  );
}
