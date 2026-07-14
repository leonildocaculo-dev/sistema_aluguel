import * as React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, User, Globe, ChevronDown, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "../ui/Button"
import { useAuthStore } from "../../stores/authStore"

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleDashboardRedirect = () => {
    if (user?.role_id === 1) navigate('/admin')
    else if (user?.role_id === 2) navigate('/owner')
    else navigate('/dashboard')
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container mx-auto max-w-[var(--container-width)] flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-primary font-['Outfit']">
            Angola<span className="text-secondary">Stay</span>
          </span>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" className="text-muted-foreground gap-2">
            <Globe className="h-4 w-4" />
            <span>PT - AOA</span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-text">Olá, {user?.name?.split(' ')[0]}</span>
              <Button variant="outline" className="gap-2" onClick={handleDashboardRedirect}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Painel</span>
              </Button>
              <Button variant="ghost" className="text-danger hover:text-danger hover:bg-danger/10 gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" className="gap-2" onClick={() => navigate('/auth/register')}>
                <span>Registar</span>
              </Button>
              <Button variant="default" className="gap-2 bg-primary" onClick={() => navigate('/auth/login')}>
                <User className="h-4 w-4" />
                <span>Fazer login</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6 text-text" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-4 shadow-lg absolute w-full">
          {isAuthenticated ? (
            <>
              <div className="px-2 pb-2 mb-2 border-b border-border">
                <p className="text-sm font-medium text-muted-foreground">Logado como</p>
                <p className="font-bold text-text">{user?.name}</p>
              </div>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleDashboardRedirect}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Meu Painel</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-danger hover:text-danger hover:bg-danger/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Sair da conta</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" className="w-full justify-start gap-2 bg-primary" onClick={() => { navigate('/auth/login'); setMobileMenuOpen(false); }}>
                <User className="h-4 w-4" />
                <span>Fazer login</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => { navigate('/auth/register'); setMobileMenuOpen(false); }}>
                <span>Criar conta</span>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
