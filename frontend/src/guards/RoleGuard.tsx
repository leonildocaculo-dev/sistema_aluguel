"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

export function RoleGuard({ children, allowedRoles = [], redirectPath = "/login" }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (allowedRoles.length > 0 && user?.role) {
      // Verifica se a role do utilizador está nos allowedRoles
      // Também verifica se é superadmin (geralmente pode aceder a tudo de admin)
      const userRole = user.role.name;
      
      const hasAccess = allowedRoles.includes(userRole) || (userRole === "superadmin" && allowedRoles.includes("admin"));
      
      if (!hasAccess) {
        // Redirecionamento default caso não tenha permissão
        if (userRole === "admin" || userRole === "superadmin") {
          router.push("/admin");
        } else if (userRole === "owner") {
          router.push("/owner");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [isAuthenticated, isClient, user, router, allowedRoles, pathname]);

  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Double check no render
  if (allowedRoles.length > 0 && user?.role) {
    const userRole = user.role.name;
    const hasAccess = allowedRoles.includes(userRole) || (userRole === "superadmin" && allowedRoles.includes("admin"));
    if (!hasAccess) return null;
  }

  return <>{children}</>;
}
