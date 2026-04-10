import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { RoleHome } from "@/components/home/RoleHome";

export const metadata: Metadata = {
  title: "Inicio — Sistema Turnero (prestadores)",
  description: "Área de trabajo del módulo prestadores.",
};

export default function HomePage() {
  return (
    <AuthGuard>
      <AppShell fallbackTitle="Inicio">
        <RoleHome />
      </AppShell>
    </AuthGuard>
  );
}
