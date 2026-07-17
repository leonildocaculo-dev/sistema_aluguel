"use client";

import { Home, Calendar, Users, Settings, LogOut, LayoutDashboard, Building, MapPin, Receipt, Wallet, Bell, CreditCard, ShieldAlert, FileText, DollarSign } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/authStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Definição estrita das rotas por papel
const routes = {
  admin: [
    { id: "properties", title: "Propriedades", url: "/admin?tab=properties", icon: Home },
    { id: "payments", title: "Pagamentos", url: "/admin?tab=payments", icon: CreditCard },
    { id: "kyc", title: "Validação KYC", url: "/admin?tab=kyc", icon: ShieldAlert },
    { id: "users", title: "Utilizadores", url: "/admin?tab=users", icon: Users },
    { id: "settings", title: "Configurações", url: "/admin?tab=settings", icon: Settings },
    { id: "logs", title: "Auditoria", url: "/admin?tab=logs", icon: FileText },
  ],
  owner: [
    { id: "overview", title: "Visão Geral", url: "/owner?tab=overview", icon: LayoutDashboard },
    { id: "properties", title: "Minhas Propriedades", url: "/owner?tab=properties", icon: Building },
    { id: "reservations", title: "Reservas", url: "/owner?tab=reservations", icon: Receipt },
    { id: "earnings", title: "Rendimentos", url: "/owner?tab=earnings", icon: DollarSign },
    { id: "kyc", title: "KYC / Identidade", url: "/owner?tab=kyc", icon: ShieldAlert },
  ]
};

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Proteção: não deve renderizar se não houver role válido ou se for client (clientes não usam a AppSidebar por padrão)
  const roleName = user?.role?.name || "client";
  const roleRoutes = roleName === "admin" || roleName === "superadmin" 
    ? routes.admin 
    : roleName === "owner" 
    ? routes.owner 
    : [];

  if (roleRoutes.length === 0) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tighter text-primary font-['Outfit']">
            Angola<span className="text-secondary">Stay</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider">
            {roleName === 'admin' || roleName === 'superadmin' ? 'Administração' : 'Gestão de Proprietário'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {roleRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.url}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate capitalize">{roleName}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-danger hover:bg-danger/10 hover:text-danger flex-shrink-0" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
