import { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResultsClient } from './SearchResultsClient';

export const metadata: Metadata = {
  title: 'Resultados de Pesquisa | AngolaStay',
  description: 'Resultados da sua pesquisa de alojamento em Angola.'
};

export default function PesquisaPage() {
  return (
    <Suspense fallback={<div className="flex w-full min-h-screen items-center justify-center">A carregar resultados...</div>}>
      <SearchResultsClient />
    </Suspense>
  );
}
