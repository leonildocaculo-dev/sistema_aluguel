"use client";

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../../services/api';
import { ArrowLeft, CheckCircle2, Loader2, CreditCard, Landmark, QrCode, Wind, Calendar, Users, Clock } from 'lucide-react';
import Image from 'next/image';

function CheckoutContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Parameters
  const dParam = searchParams.get('d');
  
  let bookingMode = 'daily';
  let guests = '1';
  let urlAccommodationId: string | null = null;
  let checkin: string | null = null;
  let checkout: string | null = null;
  let hourlyDate: string | null = null;
  let hourlyPackage: string | null = null;

  if (dParam) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(dParam)));
      bookingMode = decoded.t || 'daily';
      guests = decoded.g || '1';
      urlAccommodationId = decoded.a;
      checkin = decoded.ci;
      checkout = decoded.co;
      hourlyDate = decoded.hd;
      hourlyPackage = decoded.p;
    } catch (e) {
      console.error("Invalid URL parameters");
    }
  }
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Checkout flow state
  const [step, setStep] = useState<'form' | 'payment' | 'success' | 'delayed'>('form');
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const pollInterval = useRef<any>(null);
  const timeoutRef = useRef<any>(null);

  const [form, setForm] = useState({
    payment_method: 'proxypay', // Default
  });

  // Calculate nights
  const getNights = () => {
     if (!checkin || !checkout) return 1;
     const d1 = new Date(checkin);
     const d2 = new Date(checkout);
     const diffTime = Math.abs(d2.getTime() - d1.getTime());
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
     return diffDays > 0 ? diffDays : 1;
  };

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
    
    return () => {
      clearInterval(pollInterval.current);
      clearTimeout(timeoutRef.current);
    };
  }, [id]);

  const startPolling = (resId: number) => {
    // Timeout of 60 seconds (60000ms) to stop polling and show graceful degradation UI
    timeoutRef.current = setTimeout(() => {
      clearInterval(pollInterval.current);
      setStep('delayed');
    }, 60000);

    pollInterval.current = setInterval(async () => {
      try {
        const response = await api.get(`/reservations/${resId}/status`);
        if (response.data.status === 'confirmed') {
          clearInterval(pollInterval.current);
          clearTimeout(timeoutRef.current);
          setStep('success');
        } else if (response.data.status === 'cancelled') {
          clearInterval(pollInterval.current);
          clearTimeout(timeoutRef.current);
          alert('A reserva expirou ou foi cancelada.');
          router.push('/');
        }
      } catch (error) {
        console.error(error);
      }
    }, 3000); // Poll a cada 3 segundos
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking(true);
    try {
      const payload = {
        accommodation_id: parseInt(urlAccommodationId || (property.accommodations?.length > 0 ? property.accommodations[0].id : 0)),
        check_in: bookingMode === 'daily' ? checkin : hourlyDate,
        check_out: bookingMode === 'daily' ? checkout : hourlyDate, // backend needs checkout for hourly maybe
        payment_method: form.payment_method,
        guests: parseInt(guests),
        booking_type: bookingMode, // specific field if backend supports
        ...(bookingMode === 'hourly' && { package: hourlyPackage })
      };
      
      const response = await api.post('/reservations', payload);
      
      const { payment_intent, reservation } = response.data;
      setPaymentIntent(payment_intent);
      setStep('payment');
      
      if (form.payment_method !== 'manual') {
        startPolling(reservation.id);
      }
      
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert(error.response.data.message);
      } else {
        alert("Erro ao efectuar reserva. Verifique as datas e os campos.");
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  if (!property) return <div className="text-text text-center mt-20">Propriedade não encontrada.</div>;

  const selectedAccommodation = property.accommodations?.find((a: any) => a.id == urlAccommodationId) || property.accommodations?.[0];
  const basePrice = selectedAccommodation?.price_per_night || property.price_per_night || 0;
  
  const getHourlyPrice = (packId: string) => {
    try {
      if (selectedAccommodation?.hourly_packages) {
         const p = JSON.parse(selectedAccommodation.hourly_packages);
         if (p && p[packId]) return p[packId];
      }
    } catch(e) {}
    const hours = parseInt(packId || '2');
    return (basePrice / 24) * hours;
  };

  const totalPrice = bookingMode === 'daily' 
    ? (basePrice * getNights()) + 15000 // Base + Cleaning 
    : getHourlyPrice(hourlyPackage || '2h'); // Package

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center text-muted-foreground hover:text-text mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </button>

        {step === 'success' && (
          <div className="bg-surface/80 border border-green-500/30 rounded-3xl p-12 text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 border border-green-500/40">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-text mb-4">Pagamento Confirmado!</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              A sua reserva foi finalizada com sucesso. A sua fatura/recibo será enviada para o seu email.
            </p>
            <button onClick={() => router.push('/my-reservations')} className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Ver Minhas Reservas
            </button>
          </div>
        )}

        {step === 'delayed' && (
          <div className="bg-surface/80 border border-orange-500/30 rounded-3xl p-12 text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 mb-6 border border-orange-500/40">
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-text mb-4">Aguardando Confirmação Bancária</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              A sua reserva está salva, mas a rede bancária está a demorar mais do que o habitual a confirmar o pagamento. Não se preocupe! Assim que liquidado, emitiremos a sua fatura/recibo.
            </p>
            <button onClick={() => router.push('/my-reservations')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Acompanhar Minhas Reservas
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="bg-surface border border-border rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm">
            <h2 className="text-2xl font-bold text-text mb-6">Processar Pagamento</h2>
            
            {form.payment_method === 'proxypay' && (
              <div className="space-y-6">
                <p className="text-muted-foreground">Dirija-se a um Multicaixa ou utilize o Multicaixa Express para pagar.</p>
                <div className="bg-muted p-6 rounded-2xl border border-border inline-block text-left w-64 shadow-inner">
                  <div className="mb-4">
                    <span className="text-muted-foreground text-sm block">Entidade</span>
                    <span className="text-xl font-mono text-text tracking-widest">99999</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-muted-foreground text-sm block">Referência</span>
                    <span className="text-2xl font-mono text-primary-600 font-bold tracking-widest">{paymentIntent.gateway_reference}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm block">Montante</span>
                    <span className="text-xl font-bold text-text">{paymentIntent.amount} Kz</span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-primary-600 text-sm animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> A aguardar pagamento em tempo real...
                </div>
              </div>
            )}

            {form.payment_method === 'gpo_iframe' && (
              <div className="space-y-6">
                <p className="text-muted-foreground">Utilize o widget abaixo para efectuar o pagamento.</p>
                <div className="w-full h-96 bg-muted rounded-2xl border border-border flex items-center justify-center overflow-hidden relative">
                  <iframe 
                    src={paymentIntent.gateway_response?.iframe_url} 
                    className="w-full h-full border-0"
                    title="GPO Payment Widget"
                  ></iframe>
                </div>
                <div className="flex items-center justify-center text-primary-600 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> A aguardar confirmação via Webhook...
                </div>
              </div>
            )}

            {form.payment_method === 'manual' && (
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-2 border border-blue-500/20">
                  <Landmark className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-text">Reserva em Espera</h3>
                <p className="text-muted-foreground">Tem 24 horas para submeter o comprovativo de transferência bancária no painel de cliente.</p>
                <button onClick={() => router.push('/my-reservations')} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium mt-4 shadow-sm">
                  Ir para as Minhas Reservas
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-text mb-2">{property.name}</h1>
                <p className="text-muted-foreground text-lg flex items-center">
                  <span className="text-primary-600 font-medium mr-2">{property.municipality}, {property.province}</span>
                  • {property.address}
                </p>
              </div>

              <div className="h-80 rounded-3xl overflow-hidden bg-muted border border-border relative">
                 {property.images && property.images.length > 0 ? (
                  <Image src={property.images[0].path} alt={property.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Sem Fotografia</div>
                 )}
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-text mb-4">Método de Pagamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center transition-all transform hover:scale-105 shadow-sm hover:shadow-md ${form.payment_method === 'proxypay' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-surface border-border text-muted-foreground hover:border-orange-300 hover:text-orange-600'}`}>
                    <input type="radio" name="payment_method" value="proxypay" checked={form.payment_method === 'proxypay'} onChange={(e) => setForm({...form, payment_method: e.target.value})} className="hidden" />
                    <QrCode className={`w-12 h-12 mb-3 ${form.payment_method === 'proxypay' ? 'text-orange-600' : 'text-orange-400'}`} />
                    <span className="font-bold text-lg text-center">Referência Multicaixa</span>
                    <span className={`text-xs mt-2 text-center ${form.payment_method === 'proxypay' ? 'text-orange-600/80' : 'text-muted-foreground'}`}>Pagamento rápido via Express</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border-2 p-6 flex flex-col items-center justify-center transition-all transform hover:scale-105 shadow-sm hover:shadow-md ${form.payment_method === 'manual' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-surface border-border text-muted-foreground hover:border-blue-300 hover:text-blue-600'}`}>
                    <input type="radio" name="payment_method" value="manual" checked={form.payment_method === 'manual'} onChange={(e) => setForm({...form, payment_method: e.target.value})} className="hidden" />
                    <Landmark className={`w-12 h-12 mb-3 ${form.payment_method === 'manual' ? 'text-blue-600' : 'text-blue-400'}`} />
                    <span className="font-bold text-lg text-center">Transferência Bancária</span>
                    <span className={`text-xs mt-2 text-center ${form.payment_method === 'manual' ? 'text-blue-600/80' : 'text-muted-foreground'}`}>Upload de comprovativo manual</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sidebar Checkout Form */}
            <div className="lg:col-span-5">
              <div className="bg-surface border border-border rounded-[2rem] p-8 shadow-2xl sticky top-8">
                <div className="mb-8 pb-8 border-b border-border">
                  <h3 className="font-bold text-text mb-6 text-xl">Resumo da Reserva</h3>
                  <div className="flex items-center text-base mb-4 text-muted-foreground">
                    <span className="w-8"><Wind className="w-5 h-5 text-primary" /></span>
                    <span className="font-medium text-text">{selectedAccommodation?.name || 'Alojamento Padrão'}</span>
                  </div>
                  <div className="flex items-center text-base mb-6 text-muted-foreground">
                    <span className="w-8"><Users className="w-5 h-5 text-primary" /></span>
                    <span className="font-medium text-text">{guests} {Number(guests) === 1 ? 'hóspede' : 'hóspedes'}</span>
                  </div>
                  
                  {bookingMode === 'daily' ? (
                     <>
                        <div className="flex items-start text-base mb-4 text-muted-foreground">
                          <span className="w-8 mt-1"><Calendar className="w-5 h-5 text-primary" /></span>
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                              <span className="text-xs font-bold uppercase tracking-wider">Check-in</span>
                              <span className="font-bold text-text">{checkin ? new Date(checkin).toLocaleDateString('pt-AO') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                              <span className="text-xs font-bold uppercase tracking-wider">Check-out</span>
                              <span className="font-bold text-text">{checkout ? new Date(checkout).toLocaleDateString('pt-AO') : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                     </>
                  ) : (
                     <>
                        <div className="flex items-start text-base mb-4 text-muted-foreground">
                          <span className="w-8 mt-1"><Clock className="w-5 h-5 text-primary" /></span>
                          <div className="flex-1 space-y-3">
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                              <span className="text-xs font-bold uppercase tracking-wider">Entrada</span>
                              <span className="font-bold text-text">{hourlyDate ? new Date(hourlyDate).toLocaleString('pt-AO', { dateStyle: 'short', timeStyle: 'short'}) : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                              <span className="text-xs font-bold uppercase tracking-wider">Pacote</span>
                              <span className="font-bold text-text">{hourlyPackage}</span>
                            </div>
                          </div>
                        </div>
                     </>
                  )}
                </div>

                <div className="mb-8 pb-8 border-b border-border space-y-4">
                   {bookingMode === 'daily' ? (
                     <>
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(basePrice)} x {getNights()} noites</span>
                        <span className="text-text font-bold">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(basePrice * getNights())}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">Taxa de limpeza</span>
                        <span className="text-text font-bold">15.000,00 Kz</span>
                      </div>
                     </>
                   ) : (
                     <>
                      <div className="flex justify-between text-base">
                        <span className="text-muted-foreground">Pacote de horas</span>
                        <span className="text-text font-bold">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(getHourlyPrice(hourlyPackage || '2h'))}</span>
                      </div>
                     </>
                   )}
                </div>

                <div className="flex justify-between items-center font-black text-2xl text-text mb-8">
                  <span className="text-xl">Total <span className="text-sm font-medium text-muted-foreground ml-1">(AOA)</span></span>
                  <span className="text-primary">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(totalPrice)}</span>
                </div>

                <form onSubmit={handleBook}>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={booking}
                      className="w-full bg-primary-50 border border-primary-200 hover:bg-primary-100 text-primary-800 font-black rounded-xl py-4 transition-all hover:shadow-[0_0_20px_rgba(2,132,199,0.15)] disabled:opacity-50 flex justify-center items-center text-lg uppercase tracking-wide"
                    >
                      {booking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar e Pagar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CheckoutClient({ id }: { id: string }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}>
      <CheckoutContent id={id} />
    </Suspense>
  );
}
