"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../../../../../services/api';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InvoiceData {
  id: number;
  created_at: string;
  check_in: string;
  check_out: string;
  total_price: number;
  booking_type: string;
  user: {
    name: string;
    email: string;
  };
  accommodation: {
    name: string;
    property: {
      name: string;
      province: string;
      municipality: string;
      address: string;
      owner: {
        name: string;
        email: string;
      }
    }
  };
}

export function InvoiceClient({ id }: { id: string }) {
  const [data, setData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const response = await api.get(`/reservations/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da fatura", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInvoice();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 font-bold">Fatura não encontrada.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `FR ${new Date(data.created_at).getFullYear()}/${String(data.id).padStart(4, '0')}`;
  
  // Fake calculation for presentation (Standard 14% IVA backwards calculation logic if total includes IVA, but here we assume Base + 14% Service = Total, or just extract 14% from Total for demonstration as AGT requires Tax display)
  const taxRate = 0.14; // 14%
  const baseValue = data.total_price / (1 + taxRate);
  const taxValue = data.total_price - baseValue;

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        {/* Print Action Bar - Hidden during print */}
        <div className="mb-6 flex justify-between items-center print:hidden px-4 sm:px-0">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </button>
          <button onClick={handlePrint} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold shadow-sm transition-colors">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir / Guardar PDF
          </button>
        </div>

        {/* Invoice Paper Document */}
        <div className="bg-white p-10 sm:p-16 shadow-xl print:shadow-none print:p-0 mx-4 sm:mx-0 border border-gray-200">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b pb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">AngolaStay</h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">O seu parceiro de turismo em Angola</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">Fatura / Recibo</h2>
              <p className="text-sm text-gray-600 font-mono mt-1">Nº {invoiceNumber}</p>
              <p className="text-sm text-gray-600 font-mono">Data: {new Date(data.created_at).toLocaleDateString('pt-AO')}</p>
              <p className="text-sm text-gray-600 font-mono mt-1 bg-gray-100 inline-block px-2 py-1 rounded">Moeda: AOA</p>
            </div>
          </div>

          {/* Entities Info */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Emitente</h3>
              <p className="font-bold text-gray-900">{data.accommodation.property.name}</p>
              <p className="text-sm text-gray-600 mt-1">{data.accommodation.property.address}</p>
              <p className="text-sm text-gray-600">{data.accommodation.property.municipality}, {data.accommodation.property.province}</p>
              <p className="text-sm text-gray-600 mt-2"><span className="font-medium text-gray-800">NIF:</span> 5000000000 (Isento/Particular)</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cliente / Adquirente</h3>
              <p className="font-bold text-gray-900">{data.user.name}</p>
              <p className="text-sm text-gray-600 mt-1">{data.user.email}</p>
              <p className="text-sm text-gray-600 mt-2"><span className="font-medium text-gray-800">NIF:</span> 999999999 (Consumidor Final)</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800 text-gray-900">
                  <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider">Descrição dos Serviços</th>
                  <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-center">Data</th>
                  <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-right">Taxa IVA</th>
                  <th className="py-3 px-2 text-sm font-bold uppercase tracking-wider text-right">Valor Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-2">
                    <p className="font-bold text-gray-800">Reserva de Alojamento</p>
                    <p className="text-sm text-gray-500 mt-1">{data.accommodation.name} em {data.accommodation.property.name}</p>
                  </td>
                  <td className="py-4 px-2 text-center text-sm text-gray-600 font-mono">
                    {new Date(data.check_in).toLocaleDateString('pt-AO')} <br/> a <br/> {new Date(data.check_out).toLocaleDateString('pt-AO')}
                  </td>
                  <td className="py-4 px-2 text-right text-sm text-gray-600 font-mono">14%</td>
                  <td className="py-4 px-2 text-right text-sm text-gray-900 font-mono font-medium">
                    {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(baseValue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals & Signatures */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-12 border-t pt-8">
            <div className="w-full sm:w-1/2">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <p className="text-xs text-blue-800 font-bold mb-1 uppercase tracking-wider">Regime Legal</p>
                <p className="text-xs text-blue-900/80 leading-relaxed italic">
                  "Os bens/serviços foram colocados à disposição do adquirente na data e local do documento."
                </p>
                <p className="text-[10px] text-gray-400 mt-3 font-mono">HASH: a1b2-c3d4-e5f6-g7h8 (Processado por AngolaStay - Proforma)</p>
              </div>
            </div>

            <div className="w-full sm:w-80">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Ilíquido</span>
                  <span className="font-mono text-gray-900">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(baseValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total IVA (14%)</span>
                  <span className="font-mono text-gray-900">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(taxValue)}</span>
                </div>
                <div className="flex justify-between items-center border-t-2 border-gray-800 pt-3 mt-3">
                  <span className="font-bold text-gray-900 uppercase">Total a Pagar</span>
                  <span className="text-xl font-black text-gray-900 font-mono">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(data.total_price)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 font-medium">Obrigado pela sua preferência!</p>
            <p className="text-xs text-gray-400 mt-1">Documento processado por computador.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
