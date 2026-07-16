import { Metadata } from 'next';
import { AdminDashboardClient } from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Painel de Administração | AngolaStay',
  description: 'Gestão da plataforma AngolaStay.'
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
