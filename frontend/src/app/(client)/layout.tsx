import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { RoleGuard } from "../../guards/RoleGuard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["client"]}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto py-8">
          {children}
        </main>
        <Footer />
      </div>
    </RoleGuard>
  );
}
