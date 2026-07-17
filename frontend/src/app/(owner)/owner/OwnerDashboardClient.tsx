"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Building, DollarSign, Users, TrendingUp, ShieldAlert, Loader2, FileText, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as any, stiffness: 300, damping: 24 } }
};

export function OwnerDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const [kycStatus, setKycStatus] = useState<string>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const response = await api.get('/kyc/status');
        setKycStatus(response.data.status);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchKyc();
  }, []);

  return (
    <div className="space-y-6">
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
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {kycStatus !== 'approved' && (
              <motion.div variants={itemVariants} className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
                <div className="flex items-center mb-4 md:mb-0">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <ShieldAlert className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-500 mb-1">Verificação de Identidade Necessária</h3>
                    <p className="text-yellow-500/80 text-sm">Não pode publicar novas propriedades até que a sua identidade seja verificada pela equipa.</p>
                  </div>
                </div>
                <Button onClick={() => router.push('/owner/kyc')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold whitespace-nowrap transition-transform hover:scale-105">
                  {kycStatus === 'pending' ? 'Ver Estado KYC' : 'Fazer Verificação KYC'}
                </Button>
              </motion.div>
            )}

            {activeTab === 'overview' ? (
              <>
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Visão Geral da Propriedade</h1>
                    <p className="text-muted-foreground">Monitorize as suas reservas e lucros diários.</p>
                  </div>
                  <Button onClick={() => kycStatus === 'approved' ? router.push('/owner/properties/new') : alert('Necessita verificar a sua identidade primeiro.')} className="bg-primary hover:bg-primary/90 transition-transform hover:scale-105 shadow-md">
                    Adicionar Nova Propriedade
                  </Button>
                </motion.div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
                  <motion.div variants={itemVariants}>
                    <Card className="bg-surface border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Receita Total (Mês)</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">850.000 Kz</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> +15% desde o último mês
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Card className="bg-surface border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reservas Pendentes</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-yellow-500 mt-1">A aguardar validação de pagamento</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Card className="bg-surface border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</CardTitle>
                        <Building className="h-4 w-4 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-xs text-muted-foreground mt-1">Média das suas 2 propriedades</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <motion.h2 variants={itemVariants} className="text-xl font-bold mb-4">Reservas Recentes</motion.h2>
                <motion.div variants={itemVariants}>
                  <Card className="overflow-hidden border-none shadow-md">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead>Hóspede</TableHead>
                          <TableHead>Propriedade</TableHead>
                          <TableHead>Check-in / Check-out</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <motion.tr variants={itemVariants} className="border-b transition-colors hover:bg-muted/30">
                          <TableCell className="font-medium">Miguel Santos</TableCell>
                          <TableCell className="text-muted-foreground">Resort Épico</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">12 Fev - 15 Fev</TableCell>
                          <TableCell className="font-bold">145.000 Kz</TableCell>
                          <TableCell><Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">Confirmada</Badge></TableCell>
                        </motion.tr>
                        <motion.tr variants={itemVariants} className="border-b transition-colors hover:bg-muted/30">
                          <TableCell className="font-medium">Ana Oliveira</TableCell>
                          <TableCell className="text-muted-foreground">Apartamento Central</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">20 Fev - 22 Fev</TableCell>
                          <TableCell className="font-bold">85.000 Kz</TableCell>
                          <TableCell><Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Pendente</Badge></TableCell>
                        </motion.tr>
                      </TableBody>
                    </Table>
                  </Card>
                </motion.div>
              </>
            ) : (
              <motion.div variants={itemVariants}>
                <Card className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[200px] border-none shadow-md">
                  <p>A secção "{activeTab}" está em desenvolvimento.</p>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
