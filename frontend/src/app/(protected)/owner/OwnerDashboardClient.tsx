"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Building, DollarSign, Users, TrendingUp, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useRouter } from "next/navigation";
import { api } from "../../../services/api";

export function OwnerDashboardClient() {
  const router = useRouter();
  const [kycStatus, setKycStatus] = useState<string>('none');

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const response = await api.get('/kyc/status');
        setKycStatus(response.data.status);
      } catch (error) {
        console.error(error);
      }
    };
    fetchKyc();
  }, []);

  return (
    <div className="container mx-auto max-w-[var(--container-width)] py-10 px-4">
      <div className="space-y-6">
        
        {kycStatus !== 'approved' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <ShieldAlert className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-yellow-500 mb-1">Verificação de Identidade Necessária</h3>
                <p className="text-yellow-500/80 text-sm">Não pode publicar novas propriedades até que a sua identidade seja verificada pela equipa de administração.</p>
              </div>
            </div>
            <Button onClick={() => router.push('/owner/kyc')} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold whitespace-nowrap">
              {kycStatus === 'pending' ? 'Ver Estado KYC' : 'Fazer Verificação KYC'}
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text">Visão Geral da Propriedade</h1>
            <p className="text-muted-foreground">Monitorize as suas reservas e lucros diários.</p>
          </div>
          <Button onClick={() => kycStatus === 'approved' ? router.push('/owner/properties/new') : alert('Necessita verificar a sua identidade primeiro.')}>Adicionar Nova Propriedade</Button>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total (Mês)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">850.000 Kz</div>
              <p className="text-xs text-success flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% em relação ao mês passado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Pendentes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">3</div>
              <p className="text-xs text-warning">A aguardar validação de pagamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">78%</div>
              <p className="text-xs text-muted-foreground">Média das suas 2 propriedades</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Reservas Recentes */}
        <h2 className="text-xl font-bold text-text mt-10 mb-4">Reservas Recentes</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Hóspede</th>
                  <th className="px-6 py-4 font-medium">Propriedade</th>
                  <th className="px-6 py-4 font-medium">Check-in / Check-out</th>
                  <th className="px-6 py-4 font-medium">Valor</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-surface hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">Miguel Santos</td>
                  <td className="px-6 py-4 text-muted-foreground">Resort Épico Luanda Sul</td>
                  <td className="px-6 py-4 text-muted-foreground">12 Fev - 15 Fev</td>
                  <td className="px-6 py-4 font-medium text-text">145.000 Kz</td>
                  <td className="px-6 py-4">
                     <span className="bg-success/10 text-success text-xs font-semibold px-2.5 py-0.5 rounded-full">
                       Confirmada
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Ver</Button>
                  </td>
                </tr>
                <tr className="bg-surface hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">Ana Costa</td>
                  <td className="px-6 py-4 text-muted-foreground">Lodge Baía Azul</td>
                  <td className="px-6 py-4 text-muted-foreground">20 Fev - 22 Fev</td>
                  <td className="px-6 py-4 font-medium text-text">90.000 Kz</td>
                  <td className="px-6 py-4">
                     <span className="bg-warning/10 text-warning text-xs font-semibold px-2.5 py-0.5 rounded-full">
                       Pendente
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm">Ver</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
