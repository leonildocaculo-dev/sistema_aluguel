import { Metadata } from 'next';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  title: 'AngolaStay | Reserve Alojamentos Exclusivos em Angola',
  description: 'Encontre e reserve diretamente os melhores hotéis, resorts e alojamentos locais em Angola.'
};

export default function Page() {
  return <HomeClient />;
}
