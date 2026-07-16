import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';
import { LanguageInitializer } from '../components/shared/LanguageInitializer';
import { CookieBanner } from '../components/CookieBanner';

export const metadata: Metadata = {
  title: 'AngolaStay',
  description: 'Encontre o Alojamento Perfeito em Angola | Find the Perfect Stay in Angola',
  alternates: {
    languages: {
      'pt': '/',
      'en': '/',
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <QueryProvider>
          <LanguageInitializer />
          {children}
        </QueryProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
