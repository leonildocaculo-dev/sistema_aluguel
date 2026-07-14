import * as React from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, List, User, Heart, Settings, LogOut, Building, CheckSquare, Bell } from "lucide-react"
import { cn } from "../../../lib/utils"

export function DashboardLayout({ userType = 'client' }: { userType?: 'client' | 'owner' | 'admin' }) {
  const location = useLocation()

  const clientLinks = [
    { name: "Painel", href: "/dashboard", icon: LayoutDashboard },
    { name: "Minhas Reservas", href: "/dashboard/reservas", icon: List },
    { name: "Favoritos", href: "/dashboard/favoritos", icon: Heart },
    { name: "Perfil", href: "/dashboard/perfil", icon: User },
    { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
  ]

  const ownerLinks = [
    { name: "Visão Geral", href: "/owner", icon: LayoutDashboard },
    { name: "Minhas Propriedades", href: "/owner/propriedades", icon: Building },
    { name: "Reservas Recebidas", href: "/owner/reservas", icon: CheckSquare },
    { name: "Notificações", href: "/owner/notificacoes", icon: Bell },
    { name: "Perfil", href: "/owner/perfil", icon: User },
  ]

  const links = userType === 'owner' ? ownerLinks : clientLinks

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-muted/20 md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-surface md:flex">
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-text",
                  isActive ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
          
          <div className="mt-auto">
             <Link
                to="/"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Terminar Sessão
              </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
