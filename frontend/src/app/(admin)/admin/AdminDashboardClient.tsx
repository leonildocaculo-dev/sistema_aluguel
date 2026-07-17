"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { api } from '../../../services/api';
import { CheckCircle, XCircle, Loader2, FileText, Ban } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from 'framer-motion';

// Interfaces for Types
interface Property { id: number; name: string; status: string; owner: { name: string }; }
interface Payment { id: number; reservation_id: number; valor: number; comprovativo_path: string; reservation: { accommodation: { property: { name: string } }; user: { name: string } }; }
interface KycVerification { id: number; user: { id: number; name: string; email: string }; document_type: string; document_path: string; status: string; }
interface UserData { id: number; name: string; email: string; is_active: boolean; role: { name: string }; }

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 300, damping: 24 } }
};

export function AdminDashboardClient() {
  const { user } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'properties';
  
  // States
  const [properties, setProperties] = useState<Property[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [kycs, setKycs] = useState<KycVerification[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [settings, setSettings] = useState<any>({});
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role_id !== 1) router.push('/');
  }, [user, router]);

  useEffect(() => {
    if (activeTab === 'properties') loadProperties();
    else if (activeTab === 'payments') loadPayments();
    else if (activeTab === 'kyc') loadKycs();
    else if (activeTab === 'logs') loadLogs();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'settings') loadSettings();
  }, [activeTab]);

  // Loaders
  const loadProperties = async () => { setLoading(true); try { const r = await api.get('/admin/properties'); setProperties(r.data.data); } finally { setLoading(false); } };
  const loadPayments = async () => { setLoading(true); try { const r = await api.get('/admin/payments/pending'); setPayments(r.data.data); } finally { setLoading(false); } };
  const loadKycs = async () => { setLoading(true); try { const r = await api.get('/admin/kyc/pending'); setKycs(r.data.data); } finally { setLoading(false); } };
  const loadLogs = async () => { setLoading(true); try { const r = await api.get('/admin/logs'); setLogs(r.data.data); } finally { setLoading(false); } };
  const loadUsers = async () => { setLoading(true); try { const r = await api.get('/admin/users'); setUsersList(r.data.data); } finally { setLoading(false); } };
  const loadSettings = async () => { setLoading(true); try { const r = await api.get('/admin/settings'); setSettings(r.data.data || {}); } finally { setLoading(false); } };

  // Actions
  const handlePaymentAction = async (id: number, action: 'approve' | 'reject') => { await api.post(`/admin/payments/${id}/${action}`); loadPayments(); };
  const handleStatusChange = async (id: number, action: 'approve' | 'reject') => { await api.post(`/admin/properties/${id}/${action}`); loadProperties(); };
  const handleKycAction = async (id: number, action: 'approve' | 'reject') => {
    let data = {};
    if (action === 'reject') {
      const notes = prompt('Insira o motivo da rejeição (será enviado por email):');
      if (!notes) return;
      data = { admin_notes: notes };
    }
    await api.post(`/admin/kyc/${id}/${action}`, data); loadKycs();
  };
  
  const handleToggleUserStatus = async (id: number) => {
    if (confirm("Deseja realmente alterar o estado deste utilizador?")) {
      try {
        await api.post(`/admin/users/${id}/toggle-status`);
        loadUsers();
      } catch (e: any) { alert(e.response?.data?.message || 'Erro'); }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      alert('Configurações guardadas com sucesso!');
    } catch (e: any) { alert('Erro ao guardar configurações'); }
  };

  if (user?.role_id !== 1) return null;

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">{activeTab === 'kyc' ? 'Validação KYC' : activeTab}</h1>
          <p className="text-muted-foreground">Gestão do sistema AngolaStay.</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </motion.div>
        ) : (
          <motion.div 
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {activeTab === 'properties' && (
              <Card className="overflow-hidden border-none shadow-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Propriedade</TableHead>
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map(p => (
                      <motion.tr variants={itemVariants} key={p.id} className="border-b transition-colors hover:bg-muted/30">
                        <TableCell className="text-muted-foreground font-mono text-xs">#{p.id}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground">{p.owner?.name}</TableCell>
                        <TableCell>
                          <Badge variant={p.status === 'approved' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'} className={p.status === 'approved' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                            {p.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          {p.status === 'pending' && (
                            <>
                              <Button size="icon" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 transition-transform hover:scale-105" onClick={() => handleStatusChange(p.id, 'approve')} title="Aprovar"><CheckCircle className="w-4 h-4" /></Button>
                              <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 transition-transform hover:scale-105" onClick={() => handleStatusChange(p.id, 'reject')} title="Rejeitar"><XCircle className="w-4 h-4" /></Button>
                            </>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                    {properties.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">Sem propriedades pendentes.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card className="overflow-hidden border-none shadow-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Reserva</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Comprovativo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map(p => (
                      <motion.tr variants={itemVariants} key={p.id} className="border-b transition-colors hover:bg-muted/30">
                        <TableCell className="font-medium">#{p.reservation_id} <span className="text-muted-foreground font-normal ml-2">{p.reservation?.accommodation?.property?.name}</span></TableCell>
                        <TableCell className="text-muted-foreground">{p.reservation?.user?.name}</TableCell>
                        <TableCell className="font-bold">{p.valor} Kz</TableCell>
                        <TableCell>
                          <a href={p.comprovativo_path} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-medium flex items-center gap-1"><FileText className="w-4 h-4"/> Ver</a>
                        </TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          <Button size="icon" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 transition-transform hover:scale-105" onClick={() => handlePaymentAction(p.id, 'approve')}><CheckCircle className="w-4 h-4" /></Button>
                          <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 transition-transform hover:scale-105" onClick={() => handlePaymentAction(p.id, 'reject')}><XCircle className="w-4 h-4" /></Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    {payments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">Sem pagamentos pendentes.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Card>
            )}

            {activeTab === 'users' && (
              <Card className="overflow-hidden border-none shadow-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Nome / Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersList.map(u => (
                      <motion.tr variants={itemVariants} key={u.id} className="border-b transition-colors hover:bg-muted/30">
                        <TableCell>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-muted-foreground text-xs">{u.email}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground capitalize">{u.role?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={u.is_active ? 'default' : 'destructive'} className={u.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}>
                            {u.is_active ? 'Ativo' : 'Banido'}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          <Button size="icon" variant="outline" className={u.is_active ? 'text-red-600 border-red-200 hover:bg-red-50 transition-transform hover:scale-105' : 'text-green-600 border-green-200 hover:bg-green-50 transition-transform hover:scale-105'} onClick={() => handleToggleUserStatus(u.id)} title={u.is_active ? 'Banir Utilizador' : 'Reativar Utilizador'}>
                            {u.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

            {activeTab === 'settings' && (
              <motion.div variants={itemVariants}>
                <Card className="max-w-2xl border-none shadow-md">
                  <CardHeader>
                    <CardTitle>Configurações Globais</CardTitle>
                    <CardDescription>Ajuste taxas e informações da plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveSettings} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Taxa de Serviço (%)</label>
                        <Input type="number" value={settings.service_fee || ''} onChange={e => setSettings({...settings, service_fee: e.target.value})} placeholder="Ex: 5" className="focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email de Suporte</label>
                        <Input type="email" value={settings.support_email || ''} onChange={e => setSettings({...settings, support_email: e.target.value})} placeholder="suporte@angolastay.com" className="focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Telefone de Contacto (WhatsApp)</label>
                        <Input type="text" value={settings.support_phone || ''} onChange={e => setSettings({...settings, support_phone: e.target.value})} placeholder="+244 9XX XXX XXX" className="focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Termos e Condições (Resumo)</label>
                        <textarea value={settings.terms_summary || ''} onChange={e => setSettings({...settings, terms_summary: e.target.value})} className="w-full border rounded-md p-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Insira o texto dos termos..." />
                      </div>
                      <Button type="submit" className="w-full mt-4 transition-transform hover:scale-[1.02]">Guardar Configurações</Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'kyc' && (
              <Card className="overflow-hidden border-none shadow-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Proprietário</TableHead>
                      <TableHead>Tipo Documento</TableHead>
                      <TableHead>Ficheiro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycs.map(k => (
                      <motion.tr variants={itemVariants} key={k.id} className="border-b transition-colors hover:bg-muted/30">
                        <TableCell>
                          <div className="font-medium">{k.user.name} <span className="text-muted-foreground font-mono text-xs ml-1">#{k.user.id}</span></div>
                          <div className="text-muted-foreground text-xs">{k.user.email}</div>
                        </TableCell>
                        <TableCell className="font-medium">{k.document_type === 'id_card' ? 'B.I.' : 'Passaporte'}</TableCell>
                        <TableCell>
                          <a href={k.document_path} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-medium flex items-center gap-1"><FileText className="w-4 h-4"/> Ver</a>
                        </TableCell>
                        <TableCell className="flex justify-end space-x-2">
                          <Button size="icon" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 transition-transform hover:scale-105" onClick={() => handleKycAction(k.id, 'approve')}><CheckCircle className="w-4 h-4" /></Button>
                          <Button size="icon" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 transition-transform hover:scale-105" onClick={() => handleKycAction(k.id, 'reject')}><XCircle className="w-4 h-4" /></Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    {kycs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-12">Sem documentos pendentes.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Card>
            )}

            {activeTab === 'logs' && (
              <Card className="overflow-hidden border-none shadow-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Data</TableHead>
                      <TableHead>Utilizador / IP</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Módulo (ID)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map(log => (
                      <motion.tr variants={itemVariants} key={log.id} className="border-b transition-colors hover:bg-muted/30">
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-mono">{new Date(log.created_at).toLocaleString('pt-AO')}</TableCell>
                        <TableCell>
                          <div className="font-medium">{log.user?.name || 'Sistema/Anónimo'}</div>
                          <div className="text-muted-foreground text-xs font-mono">{log.ip_address}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className="bg-muted/50">{log.action.toUpperCase()}</Badge></TableCell>
                        <TableCell>
                          <div className="font-medium text-muted-foreground text-sm">{log.model_type?.split('\\').pop() || 'N/A'}</div>
                          <div className="text-xs font-mono text-muted-foreground">ID: {log.model_id || 'N/A'}</div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
