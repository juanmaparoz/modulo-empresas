"use client";

import { EmpresaIdShell } from "../EmpresaIdShell";
import { EntradasAsignadasClient } from "./EntradasAsignadasClient";

export function EntradasAsignadasPage() {
  return (
    <EmpresaIdShell>
      {(empresaId) => (
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Entradas asignadas
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Visitantes con sus datos. Desplegá cada fila para ver seguro y salud.
          </p>
          <div className="mt-6">
            <EntradasAsignadasClient empresaId={empresaId} />
          </div>
        </div>
      )}
    </EmpresaIdShell>
  );
}
