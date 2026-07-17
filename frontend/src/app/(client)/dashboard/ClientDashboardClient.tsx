"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar, MapPin, XCircle, ArrowRight, Home, CreditCard, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useTranslation } from "../../../i18n/useTranslation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "../../../services/reservationService";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { pt, enUS } from "date-fns/locale";
import Image from "next/image";
import { useAuthStore } from "../../../stores/authStore";
import { SidebarLayout } from "../../../components/layout/SidebarLayout";
import { ClientReservationsClient } from "../my-reservations/ClientReservationsClient";
import { ClientFavoritesClient } from "../favorites/ClientFavoritesClient";

export function ClientDashboardClient() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const dateLocale = locale === 'pt' ? pt : enUS;
  
  const [activeTab, setActiveTab] = useState('overview');

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['my-reservations'],
    queryFn: reservationService.getUserReservations,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number | string) => reservationService.cancelReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
    }
  });

  const activeReservations = reservations.filter((r: any) => r.status === 'confirmed' || r.status === 'pending');
  const pastReservations = reservations.filter((r: any) => r.status === 'completed' || r.status === 'cancelled');

  // Next trip is the earliest active reservation
  const nextTrip = activeReservations.sort((a: any, b: any) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime())[0];
  const daysUntilNextTrip = nextTrip ? differenceInDays(new Date(nextTrip.check_in_date), new Date()) : 0;

  const [imgSrc, setImgSrc] = useState<string>("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800");

  React.useEffect(() => {
     if (nextTrip) {
        let path = nextTrip.property?.images?.[0]?.path || nextTrip.property?.images?.[0]?.url;
        if (path) {
           if (!path.startsWith('http') && !path.startsWith('/')) {
              path = `http://localhost:8000/storage/${path}`;
           }
           setImgSrc(path);
        }
     }
  }, [nextTrip]);

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: <Home className="w-5 h-5" /> },
    { id: 'reservations', label: 'As minhas Reservas', icon: <Calendar className="w-5 h-5" /> },
    { id: 'favorites', label: 'Favoritos', icon: <Heart className="w-5 h-5" /> },
  ];

  if (isLoading) {
    return <div className="container mx-auto py-20 text-center text-text">Carregando...</div>;
  }

  return (
    <SidebarLayout 
      menuItems={menuItems} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      title="O Meu Painel"
      subtitle={`Bem-vindo, ${user?.name?.split(' ')[0] || 'Viajante'}`}
    >
      <div className="space-y-6">
        {activeTab === 'overview' ? (
          <>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text">{t('dashboard.welcome')} {user?.name?.split(' ')[0]}</h1>
              <p className="text-muted-foreground">{t('dashboard.summary')}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-surface border-border text-text shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.activeReservations')}</CardTitle>
                  <Calendar className="h-4 w-4 text-primary-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeReservations.length}</div>
                  {nextTrip && (
                    <p className="text-xs text-muted-foreground mt-1">{t('dashboard.nextTrip')} {daysUntilNextTrip > 0 ? daysUntilNextTrip : 0} {t('dashboard.days')}</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-surface border-border text-text shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.pastTrips')}</CardTitle>
                  <MapPin className="h-4 w-4 text-primary-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pastReservations.length}</div>
                  {pastReservations.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{t('dashboard.lastIn')} {pastReservations[0].property?.province || 'Angola'}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {nextTrip ? (
              <>
                <h2 className="text-xl font-bold text-text mt-10 mb-4">{t('dashboard.yourNextTrip')}</h2>
                <Card className="overflow-hidden bg-surface border-border text-text shadow-sm">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-muted relative">
                      <Image 
                        src={imgSrc} 
                        alt="Hotel" 
                        fill
                        onError={() => setImgSrc("https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800")}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{nextTrip.property?.name || 'Alojamento'}</h3>
                        <p className="text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                          {nextTrip.property?.municipality}, {nextTrip.property?.province}
                        </p>
                        <div className="mt-4 space-y-2 border-t border-border pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('search.checkin')}</span>
                            <span className="font-medium text-text">{format(new Date(nextTrip.check_in_date), "dd MMM yyyy", { locale: dateLocale })}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('search.checkout')}</span>
                            <span className="font-medium text-text">{format(new Date(nextTrip.check_out_date), "dd MMM yyyy", { locale: dateLocale })}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{t('search.guests')}</span>
                            <span className="font-medium text-text">{nextTrip.guests_count || 1} {nextTrip.guests_count === 1 ? t('search.guest') : t('search.guestsLabel')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white" onClick={() => router.push(`/checkout/${nextTrip.id}`)}>
                          {t('dashboard.viewDetails')}
                        </Button>
                        {nextTrip.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              if (confirm('Tem a certeza que deseja cancelar esta reserva?')) {
                                cancelMutation.mutate(nextTrip.id);
                              }
                            }}
                            disabled={cancelMutation.isPending}
                            className="w-full sm:w-auto text-red-600 border-red-500/30 hover:bg-red-50"
                          >
                            {cancelMutation.isPending ? '...' : t('dashboard.cancelReservation')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="mt-10 p-12 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center bg-surface">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-text mb-2">{t('dashboard.noReservations')}</h3>
                <Button onClick={() => router.push('/pesquisa')} className="mt-4 bg-primary-600 hover:bg-primary-700 text-white">
                  {t('dashboard.explore')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : activeTab === 'reservations' ? (
          <ClientReservationsClient />
        ) : activeTab === 'favorites' ? (
          <ClientFavoritesClient />
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center text-muted-foreground">
            <p>Seção "{menuItems.find(m => m.id === activeTab)?.label}" em desenvolvimento.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
