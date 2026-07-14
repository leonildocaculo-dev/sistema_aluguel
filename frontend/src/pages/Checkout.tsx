import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, CheckCircle2, Loader2, CreditCard, Landmark, QrCode } from 'lucide-react';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Checkout flow state
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const pollInterval = useRef<any>(null);

  const [form, setForm] = useState({
    check_in: '',
    check_out: '',
    accommodation_id: '',
    payment_method: 'proxypay', // Default
  });

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
        if (response.data.accommodations?.length > 0) {
          setForm(f => ({ ...f, accommodation_id: response.data.accommodations[0].id.toString() }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
    
    return () => clearInterval(pollInterval.current);
  }, [id]);

  const startPolling = (resId: number) => {
    pollInterval.current = setInterval(async () => {
      try {
        const response = await api.get(`/reservations/${resId}/status`);
        if (response.data.status === 'confirmed') {
          clearInterval(pollInterval.current);
          setStep('success');
        } else if (response.data.status === 'cancelled') {
          clearInterval(pollInterval.current);
          alert('A reserva expirou ou foi cancelada.');
          navigate('/');
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
      const response = await api.post('/reservations', {
        accommodation_id: parseInt(form.accommodation_id),
        check_in: form.check_in,
        check_out: form.check_out,
        payment_method: form.payment_method,
      });
      
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

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>;
  if (!property) return <div className="text-white text-center mt-20">Propriedade não encontrada.</div>;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </button>

        {step === 'success' && (
          <div className="bg-surface/80 border border-green-500/30 rounded-3xl p-12 text-center relative overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6 border border-green-500/40">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Pagamento Confirmado!</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              A sua reserva foi finalizada com sucesso. Obrigado por escolher AngolaStay.
            </p>
            <button onClick={() => navigate('/my-reservations')} className="bg-white text-black px-6 py-3 rounded-xl font-medium">
              Ver Minhas Reservas
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="bg-surface border border-white/10 rounded-3xl p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Processar Pagamento</h2>
            
            {form.payment_method === 'proxypay' && (
              <div className="space-y-6">
                <p className="text-gray-400">Dirija-se a um Multicaixa ou utilize o Multicaixa Express para pagar.</p>
                <div className="bg-black/50 p-6 rounded-2xl border border-white/10 inline-block text-left w-64">
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm block">Entidade</span>
                    <span className="text-xl font-mono text-white tracking-widest">99999</span>
                  </div>
                  <div className="mb-4">
                    <span className="text-gray-500 text-sm block">Referência</span>
                    <span className="text-2xl font-mono text-primary-400 font-bold tracking-widest">{paymentIntent.gateway_reference}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm block">Montante</span>
                    <span className="text-xl font-bold text-white">{paymentIntent.amount} Kz</span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-primary-400 text-sm animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> A aguardar pagamento em tempo real...
                </div>
              </div>
            )}

            {form.payment_method === 'gpo_iframe' && (
              <div className="space-y-6">
                <p className="text-gray-400">Utilize o widget abaixo para efectuar o pagamento.</p>
                <div className="w-full h-96 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden relative">
                  <iframe 
                    src={paymentIntent.gateway_response?.iframe_url} 
                    className="w-full h-full border-0"
                    title="GPO Payment Widget"
                  ></iframe>
                </div>
                <div className="flex items-center justify-center text-primary-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> A aguardar confirmação via Webhook...
                </div>
              </div>
            )}

            {form.payment_method === 'manual' && (
              <div className="space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-2 border border-blue-500/40">
                  <Landmark className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Reserva em Espera</h3>
                <p className="text-gray-400">Tem 24 horas para submeter o comprovativo de transferência bancária no painel de cliente.</p>
                <button onClick={() => navigate('/my-reservations')} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-medium mt-4">
                  Ir para as Minhas Reservas
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{property.name}</h1>
                <p className="text-gray-400 text-lg flex items-center">
                  <span className="text-primary-400 font-medium mr-2">{property.municipality}, {property.province}</span>
                  • {property.address}
                </p>
              </div>

              <div className="h-80 rounded-3xl overflow-hidden bg-black/50 border border-white/10 relative">
                 {property.images && property.images.length > 0 ? (
                  <img src={property.images[0].path} alt={property.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-gray-600">Sem Fotografia</div>
                 )}
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-bold text-white mb-4">Método de Pagamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all ${form.payment_method === 'proxypay' ? 'bg-primary-500/20 border-primary-500 text-white' : 'bg-surface border-white/10 text-gray-400 hover:bg-white/5'}`}>
                    <input type="radio" name="payment_method" value="proxypay" checked={form.payment_method === 'proxypay'} onChange={(e) => setForm({...form, payment_method: e.target.value})} className="hidden" />
                    <QrCode className={`w-8 h-8 mb-2 ${form.payment_method === 'proxypay' ? 'text-primary-400' : 'text-gray-500'}`} />
                    <span className="font-medium text-sm text-center">Referência Multicaixa</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all ${form.payment_method === 'gpo_iframe' ? 'bg-primary-500/20 border-primary-500 text-white' : 'bg-surface border-white/10 text-gray-400 hover:bg-white/5'}`}>
                    <input type="radio" name="payment_method" value="gpo_iframe" checked={form.payment_method === 'gpo_iframe'} onChange={(e) => setForm({...form, payment_method: e.target.value})} className="hidden" />
                    <CreditCard className={`w-8 h-8 mb-2 ${form.payment_method === 'gpo_iframe' ? 'text-primary-400' : 'text-gray-500'}`} />
                    <span className="font-medium text-sm text-center">Cartão (Iframe)</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-2xl border p-4 flex flex-col items-center justify-center transition-all ${form.payment_method === 'manual' ? 'bg-primary-500/20 border-primary-500 text-white' : 'bg-surface border-white/10 text-gray-400 hover:bg-white/5'}`}>
                    <input type="radio" name="payment_method" value="manual" checked={form.payment_method === 'manual'} onChange={(e) => setForm({...form, payment_method: e.target.value})} className="hidden" />
                    <Landmark className={`w-8 h-8 mb-2 ${form.payment_method === 'manual' ? 'text-primary-400' : 'text-gray-500'}`} />
                    <span className="font-medium text-sm text-center">Transferência Manual</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Sidebar Checkout Form */}
            <div className="lg:col-span-1">
              <div className="bg-surface/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl sticky top-8">
                <div className="mb-6 pb-6 border-b border-white/10">
                  <span className="text-3xl font-bold text-white">{property.price_per_night} Kz</span>
                  <span className="text-gray-400 ml-2">/ noite</span>
                </div>

                <form onSubmit={handleBook} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Acomodação</label>
                    <select 
                      value={form.accommodation_id}
                      onChange={e => setForm({...form, accommodation_id: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none"
                    >
                      {property.accommodations?.map((acc: any) => (
                        <option key={acc.id} value={acc.id}>{acc.name} (Max {acc.capacity} pax)</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Check-in</label>
                      <input 
                        type="date" 
                        required
                        value={form.check_in}
                        onChange={e => setForm({...form, check_in: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">Check-out</label>
                      <input 
                        type="date" 
                        required
                        value={form.check_out}
                        onChange={e => setForm({...form, check_out: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={booking}
                      className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl py-4 transition-all hover:shadow-[0_0_20px_rgba(2,132,199,0.4)] disabled:opacity-50 flex justify-center items-center"
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
