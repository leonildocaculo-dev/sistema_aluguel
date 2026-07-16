import { Metadata } from 'next';
import { OwnerDashboardClient } from './OwnerDashboardClient';

export const metadata: Metadata = {
  title: 'Painel do Proprietário | AngolaStay',
  description: 'Gira as suas propriedades e reservas.'
};

export default function OwnerPage() {
  return <OwnerDashboardClient />;
}
