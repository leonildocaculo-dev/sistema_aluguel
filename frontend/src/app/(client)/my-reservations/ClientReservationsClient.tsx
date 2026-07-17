"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Upload, FileText, Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Reservation {
  id: number;
  accommodation: { name: string, property: { name: string } };
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  review?: any; // Simples flag para ver se ja avaliou
}

export function ClientReservationsClient() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  
  // Review State
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await api.get('/reservations/me');
      setReservations(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (reservationId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('comprovativo', file);

    setUploading(reservationId);
    try {
      await api.post(`/reservations/${reservationId}/comprovativo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Comprovativo enviado com sucesso!');
      load();
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat().join('\n');
        alert(`Erro de validação:\n${errors}`);
      } else {
        alert(error.response?.data?.message || 'Erro ao enviar o ficheiro. Certifique-se que é JPG, PNG ou PDF até 5MB.');
      }
    } finally {
      setUploading(null);
    }
  };

  const submitReview = async (reservationId: number) => {
    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        reservation_id: reservationId,
        rating,
        comment
      });
      alert('Avaliação submetida com sucesso! Obrigado.');
      setReviewing(null);
      setRating(5);
      setComment('');
      load(); // Reload to hide button
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat().join('\n');
        alert(`Erro de validação:\n${errors}`);
      } else {
        alert(error.response?.data?.message || 'Erro ao submeter avaliação.');
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const isPastCheckout = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const activeReservations = reservations.filter(r => 
    !isPastCheckout(r.check_out) && r.status !== 'rejeitado'
  );

  const historyReservations = reservations.filter(r => 
    isPastCheckout(r.check_out) || r.status === 'rejeitado' || r.status === 'completed' || r.status === 'cancelled'
  );

  const displayedReservations = activeTab === 'active' ? activeReservations : historyReservations;

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Minhas Reservas</h2>
          <div className="flex bg-muted p-1 rounded-lg">
            <Button 
              variant={activeTab === 'active' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('active')}
              className="rounded-md"
            >
              Ativas
            </Button>
            <Button 
              variant={activeTab === 'history' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveTab('history')}
              className="rounded-md"
            >
              Histórico
            </Button>
          </div>
        </div>

        {displayedReservations.length === 0 ? (
          <div className="bg-surface border border-dashed border-border rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl text-text font-medium mb-2">Sem reservas nesta categoria</h3>
            <p className="text-muted-foreground">Nenhum registo encontrado.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedReservations.map(res => (
              <Card key={res.id} className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Reserva #{res.id}</span>
                    <Badge variant={res.status === 'confirmado' ? 'default' : res.status === 'rejeitado' ? 'destructive' : 'secondary'} className="capitalize">
                      {res.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{res.accommodation?.property?.name}</CardTitle>
                  <CardDescription>{res.accommodation?.name}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span className="font-medium">{res.check_in}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span className="font-medium">{res.check_out}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-bold text-lg text-primary">{res.total_price} Kz</span>
                    </div>
                  </div>

                  {reviewing === res.id && (
                    <div className="mt-6 bg-muted/50 rounded-xl p-4">
                      <h4 className="font-semibold mb-3 text-sm">Avaliar Estadia</h4>
                      <div className="flex space-x-2 mb-4">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                            <Star className={`w-5 h-5 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Como foi a sua estadia?"
                        className="w-full bg-background border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-3 min-h-[80px]"
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" disabled={submittingReview} onClick={() => submitReview(res.id)} className="w-full">
                          {submittingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Enviar'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setReviewing(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 bg-muted/20 pt-4">
                  {res.status === 'pendente_pagamento' && (
                    <div className="w-full">
                      <p className="text-xs text-center text-muted-foreground mb-3">Faça transferência e envie o comprovativo.</p>
                      <label className={`${buttonVariants({ variant: "default" })} w-full cursor-pointer relative ${uploading === res.id ? "opacity-50 pointer-events-none" : ""}`}>
                        {uploading === res.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        Anexar Comprovativo
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileUpload(res.id, e)} disabled={uploading === res.id} />
                      </label>
                    </div>
                  )}
                  {res.status === 'aguarda_validação' && (
                    <div className="w-full text-center p-3 bg-yellow-500/10 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-500 font-medium">Comprovativo em análise</p>
                    </div>
                  )}
                  {res.status === 'confirmado' && isPastCheckout(res.check_out) && reviewing !== res.id && (
                    <Button variant="outline" className="w-full border-yellow-200 text-yellow-700 bg-yellow-50 hover:bg-yellow-100" onClick={() => setReviewing(res.id)}>
                      <Star className="w-4 h-4 mr-2 text-yellow-500 fill-yellow-500" />
                      Avaliar Estadia
                    </Button>
                  )}
                  {(res.status === 'confirmado' || res.status === 'completed') && (
                    <Button variant="outline" className="w-full" onClick={() => window.open(`/my-reservations/invoice/${res.id}`, '_blank')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Baixar Fatura
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
