import { Metadata } from 'next';
import { ClientReservationsClient } from './ClientReservationsClient';

export const metadata: Metadata = {
  title: 'Minhas Reservas | AngolaStay',
  description: 'Acompanhe as suas reservas de alojamento.'
};

export default function MyReservationsPage() {
  return <ClientReservationsClient />;
}
