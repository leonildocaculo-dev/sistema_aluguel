import { Metadata } from 'next';
import { ClientDashboardClient } from './ClientDashboardClient';

export const metadata: Metadata = {
  title: 'Painel do Cliente | AngolaStay',
  description: 'Gira as suas reservas e atividades.'
};

export default function DashboardPage() {
  return <ClientDashboardClient />;
}
