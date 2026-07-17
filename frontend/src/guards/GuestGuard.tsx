"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (isAuthenticated && user?.role) {
      const userRole = user.role.name;
      if (userRole === "admin" || userRole === "superadmin") {
        router.push("/admin/dashboard");
      } else if (userRole === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    }
  }, [isAuthenticated, isClient, user, router]);

  if (!isClient) {
    return null; // Prevents hydration mismatch
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
