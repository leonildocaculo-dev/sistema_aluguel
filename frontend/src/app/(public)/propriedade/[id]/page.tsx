import { Metadata } from 'next';
import { PropertyDetailsClient } from './PropertyDetailsClient';

export const metadata: Metadata = {
  title: 'Detalhes da Propriedade | AngolaStay',
  description: 'Detalhes da propriedade em Angola.'
};

export default async function PropriedadePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PropertyDetailsClient id={id} />;
}
