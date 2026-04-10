import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { CambiarMiPasswordClient } from "@/components/perfil/CambiarMiPasswordClient";

export const metadata: Metadata = {
  title: "Cambiar contraseña",
  description: "Cambiar la contraseña de tu cuenta.",
};

export default function CambiarMiPasswordPage() {
  return (
    <AuthGuard>
      <AppShell>
        <div className="mx-auto max-w-lg">
          <CambiarMiPasswordClient />
        </div>
      </AppShell>
    </AuthGuard>
  );
}
