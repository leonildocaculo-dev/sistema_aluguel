import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { RoleGuard } from "../../guards/RoleGuard";
import { AppSidebar } from "../../components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { AntiDebugWrapper } from "../../components/shared/AntiDebugWrapper";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin", "superadmin"]}>
      <AntiDebugWrapper>
        <SidebarProvider>
          <AppSidebar />
          <div className="flex min-h-screen flex-col bg-background w-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-surface">
              <SidebarTrigger className="-ml-1" />
              <div className="font-semibold">Painel Executivo</div>
            </header>
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </AntiDebugWrapper>
    </RoleGuard>
  );
}
