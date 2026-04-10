"use client";

import { ComprarEntradasClient } from "./ComprarEntradasClient";
import { EmpresaIdShell } from "../EmpresaIdShell";

export function ComprarEntradasPage() {
  return (
    <EmpresaIdShell>
      {(empresaId) => (
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Comprar entradas
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Comprá por lote o cantidad personalizada.
          </p>
          <div className="mt-6">
            <ComprarEntradasClient empresaId={empresaId} />
          </div>
        </div>
      )}
    </EmpresaIdShell>
  );
}
