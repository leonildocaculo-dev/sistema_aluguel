"use client";

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, User, Globe, ChevronDown, LogOut, LayoutDashboard, X, Check } from "lucide-react"
import { Button } from "../ui/button"
import { useAuthStore } from "../../stores/authStore"
import { useLanguageStore } from "../../stores/languageStore"
import { useTranslation } from "../../i18n/useTranslation"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const { locale, setLocale } = useLanguageStore()
  const { t } = useTranslation()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
    setMobileMenuOpen(false)
  }

  const handleDashboardRedirect = () => {
    if (user?.role_id === 1) router.push('/admin')
    else if (user?.role_id === 2) router.push('/owner')
    else router.push('/dashboard')
    setMobileMenuOpen(false)
  }

  const languages = [
    { code: 'pt' as const, label: 'PT - AOA', flag: '🇦🇴' },
    { code: 'en' as const, label: 'EN - USD', flag: '🇬🇧' },
  ]

  const currentLang = languages.find(l => l.code === locale) || languages[0]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto max-w-[var(--container-width)] flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-primary font-['Outfit']">
            Angola<span className="text-secondary">Stay</span>
          </span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Toggle */}
          {mounted && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-text font-semibold gap-2 text-base">
                  <Globe className="h-5 w-5 text-primary" />
                  <span>{currentLang.flag} {currentLang.label}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-1" align="end">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLocale(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      locale === lang.code 
                        ? 'bg-primary/10 text-primary font-semibold' 
                        : 'hover:bg-muted text-text'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      {lang.label}
                    </span>
                    {locale === lang.code && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          )}

          {mounted && (isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-base font-semibold text-text">{t('header.hello')}, <span className="text-primary">{user?.name?.split(' ')[0]}</span></span>
              <Button variant="outline" className="gap-2 font-bold border-primary/20 hover:bg-primary/5" onClick={handleDashboardRedirect}>
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <span>{t('header.panel')}</span>
              </Button>
              <Button variant="ghost" className="text-danger font-semibold hover:text-danger hover:bg-danger/10 gap-2" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span>{t('header.logout')}</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" className="gap-2 font-semibold text-base text-text hover:text-primary" onClick={() => router.push('/registo')}>
                <span>{t('header.register')}</span>
              </Button>
              <Button variant="default" className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-base px-6 shadow-md hover:shadow-lg transition-all" onClick={() => router.push('/login')}>
                <User className="h-5 w-5" />
                <span>{t('header.login')}</span>
              </Button>
            </div>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-text" /> : <Menu className="h-6 w-6 text-text" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-4 shadow-lg absolute w-full z-50">
          {/* Language selector mobile */}
          <div className="flex gap-2 pb-3 mb-3 border-b border-border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLocale(lang.code); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  locale === lang.code 
                    ? 'bg-primary/10 text-primary border border-primary/30' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span>{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              <div className="px-2 pb-2 mb-2 border-b border-border">
                <p className="text-sm font-medium text-muted-foreground">{t('header.loggedAs')}</p>
                <p className="font-bold text-text">{user?.name}</p>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleDashboardRedirect}>
                <LayoutDashboard className="h-4 w-4" />
                <span>{t('header.myPanel')}</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-danger hover:text-danger hover:bg-danger/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>{t('header.logoutAccount')}</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" className="w-full justify-start gap-2 bg-primary" onClick={() => { router.push('/login'); setMobileMenuOpen(false); }}>
                <User className="h-4 w-4" />
                <span>{t('header.login')}</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { router.push('/registo'); setMobileMenuOpen(false); }}>
                <span>{t('header.createAccount')}</span>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
