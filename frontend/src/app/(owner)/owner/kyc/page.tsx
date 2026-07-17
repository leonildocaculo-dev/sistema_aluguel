"use client";

import { useEffect, useState } from 'react';
import { api } from '../../../../services/api';
import { useAuthStore } from '../../../../stores/authStore';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Upload, AlertCircle, Clock, CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';

export default function KycPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [adminNotes, setAdminNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [docType, setDocType] = useState('id_card');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (user && user.role_id !== 2) {
      router.push('/');
      return;
    }
    loadStatus();
  }, [user, router]);

  const loadStatus = async () => {
    try {
      const response = await api.get('/kyc/status');
      setStatus(response.data.status);
      setAdminNotes(response.data.admin_notes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('document_type', docType);
    formData.append('document', file);

    try {
      await api.post('/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Documento enviado com sucesso! Aguarde a validação.');
      loadStatus();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao enviar documento.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex justify-center items-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.push('/owner')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
        </button>

        <div className="bg-surface border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
              <ShieldCheck className="w-10 h-10 text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Verificação de Identidade (KYC)</h1>
            <p className="text-gray-400">
              Para garantir a segurança da nossa comunidade, todos os proprietários devem verificar a sua identidade antes de listar propriedades.
            </p>
          </div>

          {status === 'approved' && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-400 mb-2">Identidade Verificada</h2>
              <p className="text-green-500/80">O seu documento foi aprovado. Já pode listar e gerir as suas propriedades livremente.</p>
            </div>
          )}

          {status === 'pending' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
              <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Em Análise</h2>
              <p className="text-yellow-500/80">O seu documento foi recebido e está a ser analisado pela nossa equipa. Este processo pode demorar até 24 horas.</p>
            </div>
          )}

          {status === 'rejected' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <XCircle className="w-6 h-6 text-red-400 mr-4 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-bold text-red-400 mb-1">Documento Rejeitado</h2>
                  <p className="text-red-400/80 mb-3">Infelizmente, o documento enviado não foi aceite.</p>
                  {adminNotes && (
                    <div className="bg-black/20 rounded-lg p-4 border border-red-500/10">
                      <strong className="text-red-300 block mb-1">Motivo:</strong>
                      <span className="text-red-200/80">{adminNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {(status === 'none' || status === 'rejected') && (
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-medium text-white mb-4">Submeter Documento</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tipo de Documento</label>
                  <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    <option value="id_card">Bilhete de Identidade</option>
                    <option value="passport">Passaporte</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Anexar Ficheiro (PDF, JPG, PNG)</label>
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:bg-white/[0.02] transition-colors">
                    <input 
                      type="file" 
                      id="doc-upload" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      required
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-3" />
                      {file ? (
                        <span className="text-primary-400 font-medium">{file.name}</span>
                      ) : (
                        <>
                          <span className="text-white font-medium mb-1">Clique para fazer upload</span>
                          <span className="text-gray-500 text-sm">Tamanho máximo: 5MB</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex bg-blue-500/10 rounded-xl p-4 mb-6">
                  <AlertCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-300">Certifique-se de que o documento é visível, não tem cortes nas bordas e os dados são perfeitamente legíveis.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={uploading || !file}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl py-4 transition-all disabled:opacity-50 flex justify-center items-center"
                >
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {uploading ? 'A enviar...' : 'Submeter para Verificação'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
