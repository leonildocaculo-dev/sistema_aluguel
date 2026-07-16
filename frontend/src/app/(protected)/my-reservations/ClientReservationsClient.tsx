"use client";

import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { ArrowLeft, Upload, CheckCircle, Clock, XCircle, FileText, Loader2, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      const response = await api.get('/my-reservations');
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
      console.error(error);
      alert(error.response?.data?.message || 'Erro ao enviar o ficheiro.');
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
      alert(error.response?.data?.message || 'Erro ao submeter avaliação.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const isPastCheckout = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push('/')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-8">Minhas Reservas</h1>

        {reservations.length === 0 ? (
          <div className="bg-surface/50 border border-white/10 rounded-3xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Ainda não tem reservas</h3>
            <p className="text-gray-400">Pesquise alojamentos e faça a sua primeira reserva.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map(res => (
              <div key={res.id} className="bg-surface/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs font-semibold tracking-wider text-primary-400 uppercase">Reserva #{res.id}</span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full flex items-center ${
                      res.status === 'confirmado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      res.status === 'rejeitado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {res.status === 'confirmado' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {res.status === 'rejeitado' && <XCircle className="w-3 h-3 mr-1" />}
                      {(res.status === 'pendente_pagamento' || res.status === 'aguarda_validação') && <Clock className="w-3 h-3 mr-1" />}
                      {res.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{res.accommodation?.property?.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{res.accommodation?.name}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-300">
                    <div><span className="text-gray-500">Check-in:</span> {res.check_in}</div>
                    <div><span className="text-gray-500">Check-out:</span> {res.check_out}</div>
                    <div><span className="text-gray-500">Total:</span> <span className="font-bold text-white">{res.total_price} Kz</span></div>
                  </div>

                  {reviewing === res.id && (
                    <div className="mt-6 bg-black/40 border border-white/10 rounded-xl p-4">
                      <h4 className="font-semibold text-white mb-3">Avaliar Estadia</h4>
                      <div className="flex space-x-2 mb-4">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                            <Star className={`w-6 h-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                          </button>
                        ))}
                      </div>
                      <textarea 
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Como foi a sua estadia? (Opcional)"
                        className="w-full bg-surface border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-500 mb-3 min-h-[80px]"
                      />
                      <div className="flex space-x-2">
                        <button disabled={submittingReview} onClick={() => submitReview(res.id)} className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center">
                          {submittingReview ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Enviar Avaliação'}
                        </button>
                        <button onClick={() => setReviewing(null)} className="bg-transparent hover:bg-white/5 text-gray-400 text-sm font-medium py-2 px-4 rounded-lg">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full md:w-auto flex flex-col space-y-2">
                  {res.status === 'pendente_pagamento' && (
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-center">
                      <p className="text-sm text-gray-400 mb-3">Faça transferência e envie o comprovativo.</p>
                      <label className="cursor-pointer bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg py-2.5 px-4 transition-all flex items-center justify-center">
                        {uploading === res.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                        Anexar Comprovativo
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileUpload(res.id, e)} disabled={uploading === res.id} />
                      </label>
                    </div>
                  )}
                  {res.status === 'aguarda_validação' && (
                    <div className="text-center p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                      <p className="text-sm text-yellow-500/80">Comprovativo em análise.</p>
                    </div>
                  )}
                  {res.status === 'confirmado' && isPastCheckout(res.check_out) && reviewing !== res.id && (
                    <button onClick={() => setReviewing(res.id)} className="flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                      <Star className="w-4 h-4 mr-2 text-yellow-400" />
                      Avaliar Estadia
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
