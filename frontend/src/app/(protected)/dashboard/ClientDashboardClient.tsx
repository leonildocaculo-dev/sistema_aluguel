"use client";

import * as React from "react";
import { Calendar, MapPin, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useTranslation } from "../../../i18n/useTranslation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService } from "../../../services/reservationService";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { pt, enUS } from "date-fns/locale";
import { useAuthStore } from "../../../stores/authStore";

export function ClientDashboardClient() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const dateLocale = locale === 'pt' ? pt : enUS;

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

  if (isLoading) {
    return <div className="container mx-auto py-20 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-[var(--container-width)] py-10 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">{t('dashboard.welcome')} {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground">{t('dashboard.summary')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.activeReservations')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">{activeReservations.length}</div>
              {nextTrip && (
                <p className="text-xs text-muted-foreground">{t('dashboard.nextTrip')} {daysUntilNextTrip > 0 ? daysUntilNextTrip : 0} {t('dashboard.days')}</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.pastTrips')}</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text">{pastReservations.length}</div>
              {pastReservations.length > 0 && (
                <p className="text-xs text-muted-foreground">{t('dashboard.lastIn')} {pastReservations[0].property?.province || 'Angola'}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {nextTrip ? (
          <>
            <h2 className="text-xl font-bold text-text mt-10 mb-4">{t('dashboard.yourNextTrip')}</h2>
            <Card className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-muted">
                  <img 
                    src={nextTrip.property?.images?.[0]?.path || nextTrip.property?.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"} 
                    alt="Hotel" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-text">{nextTrip.property?.name || 'Alojamento'}</h3>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {nextTrip.property?.municipality}, {nextTrip.property?.province}
                    </p>
                    <div className="mt-4 space-y-2">
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
                    <Button className="w-full sm:w-auto" onClick={() => router.push(`/checkout/${nextTrip.id}`)}>
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
                        className="w-full sm:w-auto text-danger border-danger/30 hover:bg-danger/10 hover:text-danger"
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
            <Button onClick={() => router.push('/pesquisa')} className="mt-4">
              {t('dashboard.explore')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
