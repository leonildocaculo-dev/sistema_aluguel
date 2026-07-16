import { Metadata } from 'next';
import { InfoClient } from './InfoClient';

export const metadata: Metadata = {
  title: 'Informações Institucionais | AngolaStay',
  description: 'Informações sobre a plataforma AngolaStay.'
};

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <InfoClient slug={slug} />;
}
