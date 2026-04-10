import type { ReactNode } from "react";
import { SuperGuard } from "@/components/super/SuperGuard";
import { AppShell } from "@/components/layout/AppShell";

export default function SuperLayout({ children }: { children: ReactNode }) {
  return (
    <SuperGuard>
      <AppShell>
        <div className="mx-auto w-full max-w-4xl">{children}</div>
      </AppShell>
    </SuperGuard>
  );
}
