"use client";

import * as React from "react"
import Link from "next/link"
import { useTranslation } from "../../i18n/useTranslation"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="w-full border-t border-border bg-surface py-12 mt-16 shadow-inner">
      <div className="container mx-auto max-w-[var(--container-width)] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-text text-lg mb-6 tracking-wide">{t('footer.aboutUs')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/info/como-funciona" className="hover:text-primary transition-colors font-medium">{t('footer.howItWorks')}</Link></li>
              <li><Link href="/info/missao" className="hover:text-primary transition-colors font-medium">{t('footer.mission')}</Link></li>
              <li><Link href="/info/sustentabilidade" className="hover:text-primary transition-colors font-medium">{t('footer.sustainability')}</Link></li>
              <li><Link href="/info/carreiras" className="hover:text-primary transition-colors font-medium">{t('footer.careers')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-text text-lg mb-6 tracking-wide">{t('footer.community')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/info/blog" className="hover:text-primary transition-colors font-medium">{t('footer.blog')}</Link></li>
              <li><Link href="/info/avaliacoes" className="hover:text-primary transition-colors font-medium">{t('footer.reviews')}</Link></li>
              <li><Link href="/info/regras-convivencia" className="hover:text-primary transition-colors font-medium">{t('footer.rules')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-text text-lg mb-6 tracking-wide">{t('footer.hosting')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/info/seja-anfitriao" className="hover:text-primary transition-colors font-medium">{t('footer.becomeHost')}</Link></li>
              <li><Link href="/info/recursos-anfitriao" className="hover:text-primary transition-colors font-medium">{t('footer.hostResources')}</Link></li>
              <li><Link href="/info/forum" className="hover:text-primary transition-colors font-medium">{t('footer.communityForum')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-text text-lg mb-6 tracking-wide">{t('footer.support')}</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/info/central-ajuda" className="hover:text-primary transition-colors font-medium">{t('footer.helpCenter')}</Link></li>
              <li><Link href="/info/opcoes-cancelamento" className="hover:text-primary transition-colors font-medium">{t('footer.cancellation')}</Link></li>
              <li><Link href="/info/acessibilidade" className="hover:text-primary transition-colors font-medium">{t('footer.accessibility')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <Link href="/info/privacidade" className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors">{t('footer.privacy')}</Link>
            <Link href="/info/termos" className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors">{t('footer.terms')}</Link>
            <Link href="/info/mapa-site" className="text-sm text-muted-foreground font-medium hover:text-primary transition-colors">{t('footer.sitemap')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
