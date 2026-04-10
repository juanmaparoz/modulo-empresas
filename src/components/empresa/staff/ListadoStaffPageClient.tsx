"use client";

import { StaffListadoClient } from "./StaffListadoClient";

type Props = {
  empresaId: string;
};

export function ListadoStaffPageClient({ empresaId }: Props) {
  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">Listado de staff</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Personal dado de alta. La administración ANP confirma cada alta; podés
        habilitar o deshabilitar empleados.
      </p>
      <div className="mt-6">
        <StaffListadoClient empresaId={empresaId} />
      </div>
    </div>
  );
}
