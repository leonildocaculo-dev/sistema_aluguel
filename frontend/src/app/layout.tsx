import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '../providers/QueryProvider';
import { LanguageInitializer } from '../components/shared/LanguageInitializer';
import { CookieBanner } from '../components/CookieBanner';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="pt" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head />
      <body suppressHydrationWarning>
        <QueryProvider>
          <LanguageInitializer />
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </QueryProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
