import type { ReactNode } from "react";
import { CompanyGuard } from "@/components/empresa/CompanyGuard";
import { AppShell } from "@/components/layout/AppShell";

export default function EmpresaLayout({ children }: { children: ReactNode }) {
  return (
    <CompanyGuard>
      <AppShell>
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </AppShell>
    </CompanyGuard>
  );
}
