import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { EditarPerfilClient } from "@/components/perfil/EditarPerfilClient";

export const metadata: Metadata = {
  title: "Editar perfil",
  description: "Editar datos de tu cuenta.",
};

export default function PerfilPage() {
  return (
    <AuthGuard>
      <AppShell>
        <div className="mx-auto max-w-lg">
          <EditarPerfilClient />
        </div>
      </AppShell>
    </AuthGuard>
  );
}
