"use client";

import Link from "next/link";
import { EmpresaIdShell } from "../EmpresaIdShell";
import { MisComprasClient } from "./MisComprasClient";

export function MisComprasPage() {
  return (
    <EmpresaIdShell>
      {(empresaId) => (
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            Compras y asignar
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600">
            Historial de compras y asignación de entradas a visitantes. Ver{" "}
            <Link
              href="/empresa/entradas/asignadas"
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600"
            >
              entradas asignadas
            </Link>
            .
          </p>
          <div className="mt-6">
            <MisComprasClient empresaId={empresaId} />
          </div>
        </div>
      )}
    </EmpresaIdShell>
  );
}
