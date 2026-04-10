"use client";

import { RegistrarStaffClient } from "./RegistrarStaffClient";
import { StaffRouteShell } from "./StaffRouteShell";

export function RegistrarStaffPage() {
  return (
    <StaffRouteShell>
      {(empresaId) => <RegistrarStaffClient empresaId={empresaId} />}
    </StaffRouteShell>
  );
}
