"use client";

import { ListadoStaffPageClient } from "./ListadoStaffPageClient";
import { StaffRouteShell } from "./StaffRouteShell";

export function ListadoStaffPage() {
  return (
    <StaffRouteShell>
      {(empresaId) => <ListadoStaffPageClient empresaId={empresaId} />}
    </StaffRouteShell>
  );
}
