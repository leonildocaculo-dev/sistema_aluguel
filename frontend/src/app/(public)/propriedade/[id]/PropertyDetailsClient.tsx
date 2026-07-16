"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MapPin, Star, Share, Heart, Check, Wifi, Car, Coffee, Wind, Loader2 } from "lucide-react";

import { Button } from "../../../../components/ui/Button";
import { Card, CardContent } from "../../../../components/ui/Card";
import { api } from "../../../../services/api";

export function PropertyDetailsClient({ id }: { id: string }) {
  const router = useRouter();
  const [property, setProperty] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProperty() {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Erro ao carregar propriedade", error);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return <div className="text-center py-20 text-text">Propriedade não encontrada.</div>;
  }

  // Preço base pode vir da primeira acomodação
  const basePrice = property.accommodations?.length > 0 ? property.accommodations[0].price_per_night : property.price_per_night || 0;
  
  // Dummy amenities for MVP since backend might not send them yet
  const amenities = [
    { name: "Piscina", icon: <Check className="h-5 w-5 text-primary" /> },
    { name: "Wi-Fi Gratuito", icon: <Wifi className="h-5 w-5 text-primary" /> },
    { name: "Estacionamento", icon: <Car className="h-5 w-5 text-primary" /> },
    { name: "Pequeno-almoço", icon: <Coffee className="h-5 w-5 text-primary" /> },
    { name: "Ar Condicionado", icon: <Wind className="h-5 w-5 text-primary" /> },
  ];

  return (
    <div className="container mx-auto max-w-[var(--container-width)] py-8 px-4">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
            {property.name}
          </h1>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center text-text font-medium">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              {property.rating || "4.8"} 
            </span>
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {property.municipality}, {property.province}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="gap-2">
            <Share className="h-4 w-4" />
            Partilhar
          </Button>
          <Button variant="outline" className="gap-2">
            <Heart className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 bg-muted">
        {property.images && property.images.length > 0 ? (
           <>
            <div className="md:col-span-2 row-span-2 relative">
              <img src={property.images[0]?.path} alt="Principal" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block relative">
              <img src={property.images[1]?.path || property.images[0]?.path} alt="Foto 2" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block relative">
              <img src={property.images[2]?.path || property.images[0]?.path} alt="Foto 3" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block relative">
              <img src={property.images[3]?.path || property.images[0]?.path} alt="Foto 4" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block relative">
              <img src={property.images[4]?.path || property.images[0]?.path} alt="Foto 5" className="w-full h-full object-cover" />
            </div>
           </>
        ) : (
           <div className="col-span-4 row-span-2 flex items-center justify-center text-muted-foreground">
              Sem Imagens Disponíveis
           </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Details (Left) */}
        <div className="flex-1">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-text mb-4">Sobre este espaço</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </section>

          <hr className="border-border my-8" />

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-text mb-6">O que este lugar oferece</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3 text-text">
                  {amenity.icon}
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6">
              Mostrar todas as comodidades
            </Button>
          </section>

          <hr className="border-border my-8" />

          {/* Características / Acomodações */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-text mb-6">Tipos de Alojamento Disponíveis</h2>
            {property.accommodations && property.accommodations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.accommodations.map((acc: any) => (
                  <Card key={acc.id} className="bg-surface border-border">
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-primary mb-2">{acc.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 h-10 line-clamp-2">{acc.description}</p>
                      
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-text flex items-center"><Wind className="w-4 h-4 mr-1"/> Capacidade</span>
                        <span className="font-medium text-text">Até {acc.capacity} pessoas</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span className="text-text">Preço base</span>
                        <span className="font-bold text-primary">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(acc.price_per_night)}</span>
                      </div>

                      <div className="bg-muted p-2 rounded text-xs text-center text-muted-foreground">
                        {acc.rental_type === 'both' ? 'Permite reserva por horas e noites' : 'Apenas reserva por noites'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Não há detalhes específicos de alojamento disponíveis.</p>
            )}
          </section>
          
          <hr className="border-border my-8" />
          
          <section className="mb-10">
             <h2 className="text-2xl font-bold text-text mb-6">Localização</h2>
             <div className="w-full h-[300px] bg-muted rounded-xl flex items-center justify-center border border-border">
                <span className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mapa: {property.address}
                </span>
             </div>
          </section>

          <hr className="border-border my-8" />

          {/* Reviews Section */}
          <section className="mb-10">
             <h2 className="text-2xl font-bold text-text mb-6 flex items-center">
               <Star className="h-6 w-6 fill-primary text-primary mr-2" />
               Avaliações
             </h2>
             <div className="bg-surface border border-border p-6 rounded-xl">
                {property.accommodations && property.accommodations.length > 0 ? (
                  <ReviewList accommodationId={property.accommodations[0].id.toString()} />
                ) : (
                  <p className="text-muted-foreground">Sem acomodações registadas para ler avaliações.</p>
                )}
             </div>
          </section>
        </div>

        {/* Booking Sidebar (Right) */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <Card className="shadow-2xl border-border/60 bg-surface">
              <CardContent className="p-6">
                <BookingWidget property={property} basePrice={basePrice} router={router} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingWidget({ property, basePrice, router }: { property: any, basePrice: number, router: any }) {
  const [bookingMode, setBookingMode] = React.useState<'daily' | 'hourly'>('daily');
  const [selectedPackage, setSelectedPackage] = React.useState('2h');
  const packages = [
    { id: '2h', label: '2 Horas' },
    { id: '5h', label: '5 Horas' },
    { id: '10h', label: '10 Horas' },
    { id: '12h', label: '12 Horas' },
    { id: '24h', label: '24 Horas' }
  ];

  // Dummy parsing for MVP based on property.accommodations or fallback math
  const getHourlyPrice = (packId: string) => {
    try {
      if (property.accommodations && property.accommodations[0]?.hourly_packages) {
         const p = JSON.parse(property.accommodations[0].hourly_packages);
         if (p && p[packId]) return p[packId];
      }
    } catch(e) {}
    // Fallback math if JSON is empty
    const hours = parseInt(packId);
    return (basePrice / 24) * hours;
  };

  const handleBook = () => {
    // In production, pass dates/hours via context or query params
    const query = new URLSearchParams({
      type: bookingMode,
      ...(bookingMode === 'hourly' ? { package: selectedPackage } : {})
    });
    router.push(`/checkout/${property.id}?${query.toString()}`);
  };

  return (
    <div>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-2xl font-bold text-text">
          {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(
            bookingMode === 'daily' ? basePrice : getHourlyPrice(selectedPackage)
          )}
        </span>
        <span className="text-muted-foreground text-sm">
          {bookingMode === 'daily' ? '/ noite' : '/ pacote'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/40 rounded-lg p-1 mb-6 border border-border/50">
        <button 
          onClick={() => setBookingMode('daily')}
          className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${bookingMode === 'daily' ? 'bg-surface shadow-sm text-primary' : 'text-muted-foreground hover:text-text'}`}
        >
          Curta / Longa Duração
        </button>
        <button 
          onClick={() => setBookingMode('hourly')}
          className={`flex-1 text-sm font-bold py-2 rounded-md transition-all ${bookingMode === 'hourly' ? 'bg-surface shadow-sm text-primary' : 'text-muted-foreground hover:text-text'}`}
        >
          Por Horas
        </button>
      </div>

      {bookingMode === 'hourly' && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm font-medium">
          <Wind className="w-5 h-5 mb-2 inline-block mr-2" />
          Atenção: As encomendas por horas precisam de ser feitas com pelo menos <strong>1 a 2 horas de antecedência</strong> em relação à chegada, mediante disponibilidade.
        </div>
      )}

      <div className="border border-border rounded-xl mb-6 overflow-hidden">
        {bookingMode === 'daily' ? (
          <div className="flex border-b border-border">
            <div className="flex-1 p-3 border-r border-border cursor-pointer hover:bg-muted/30">
              <span className="block text-xs font-bold text-text uppercase">Check-in</span>
              <span className="text-sm text-muted-foreground">Adicionar data</span>
            </div>
            <div className="flex-1 p-3 cursor-pointer hover:bg-muted/30">
              <span className="block text-xs font-bold text-text uppercase">Check-out</span>
              <span className="text-sm text-muted-foreground">Adicionar data</span>
            </div>
          </div>
        ) : (
          <div className="flex border-b border-border">
             <div className="flex-1 p-3 border-r border-border cursor-pointer hover:bg-muted/30">
              <span className="block text-xs font-bold text-text uppercase">Data / Hora de Entrada</span>
              <input type="datetime-local" className="w-full bg-transparent text-sm text-text outline-none mt-1" />
            </div>
            <div className="flex-1 p-3 cursor-pointer hover:bg-muted/30">
              <span className="block text-xs font-bold text-text uppercase">Pacote</span>
              <select 
                className="w-full bg-transparent text-sm text-text outline-none mt-1 cursor-pointer"
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
              >
                {packages.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="p-3 cursor-pointer hover:bg-muted/30 flex justify-between items-center">
          <div>
            <span className="block text-xs font-bold text-text uppercase">Hóspedes</span>
            <span className="text-sm text-muted-foreground">1 hóspede</span>
          </div>
          <span className="text-xl text-muted-foreground">&#8964;</span>
        </div>
      </div>

      <Button onClick={handleBook} size="lg" className="w-full text-lg font-bold h-14 mb-4 shadow-lg hover:shadow-xl transition-all">
        {bookingMode === 'daily' ? 'Reservar Alojamento' : 'Encomendar Serviço'}
      </Button>
      
      <p className="text-center text-xs text-muted-foreground mb-6 font-medium">
        Ainda não será cobrado nenhum valor. Será notificado(a) por e-mail sobre o pagamento.
      </p>

      {bookingMode === 'daily' && (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-between text-text text-sm">
            <span className="underline cursor-pointer">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(basePrice)} x 5 noites</span>
            <span className="font-medium">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(basePrice * 5)}</span>
          </div>
          <div className="flex justify-between text-text text-sm">
            <span className="underline cursor-pointer">Taxa de limpeza</span>
            <span className="font-medium">15.000,00 Kz</span>
          </div>
          <div className="flex justify-between text-text text-sm">
            <span className="underline cursor-pointer">Taxa de serviço AngolaStay</span>
            <span className="font-medium">12.500,00 Kz</span>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg text-text">
            <span>Total estimado</span>
            <span className="text-primary">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format((basePrice * 5) + 15000 + 12500)}</span>
          </div>
        </div>
      )}
      
      {bookingMode === 'hourly' && (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex justify-between text-text text-sm">
            <span className="underline cursor-pointer">Pacote {packages.find(p=>p.id===selectedPackage)?.label}</span>
            <span className="font-medium">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(getHourlyPrice(selectedPackage))}</span>
          </div>
          <div className="flex justify-between text-text text-sm">
            <span className="underline cursor-pointer">Taxa de serviço AngolaStay</span>
            <span className="font-medium">2.500,00 Kz</span>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-lg text-text">
            <span>Total estimado</span>
            <span className="text-primary">{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(getHourlyPrice(selectedPackage) + 2500)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewList({ accommodationId }: { accommodationId: string }) {
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({ average: 0, total: 0 });

  React.useEffect(() => {
    // Para efeito visual estamos a forcar o ID 1
    const fetchReviews = async () => {
      try {
        const { api } = await import('../../../../services/api');
        const res = await api.get(`/accommodations/${accommodationId}/reviews`);
        setReviews(res.data.reviews.data);
        setStats({ average: res.data.average_rating, total: res.data.total_reviews });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [accommodationId]);

  if (loading) return <div className="text-center py-4 text-gray-500">A carregar avaliações...</div>;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white">Sem avaliações ainda</h3>
        <p className="text-gray-400 text-sm">Seja o primeiro a avaliar após uma estadia!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-8">
        <div className="text-4xl font-bold text-white">{stats.average}</div>
        <div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-5 h-5 ${i <= stats.average ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-1">Com base em {stats.total} avaliações</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviews.map((r: any) => (
          <div key={r.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold mr-3">
                {r.user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-white">{r.user.name}</h4>
                <div className="flex items-center text-xs text-gray-400">
                  <span className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= r.rating ? 'fill-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </span>
                  {new Date(r.created_at).toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-3">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
