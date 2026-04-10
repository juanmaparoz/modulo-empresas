"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LoteCreateForm } from "./LoteCreateForm";

export function RegistrarLotePage() {
  const router = useRouter();

  const onCreated = useCallback(() => {
    router.push("/admin/lotes/listado");
  }, [router]);

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Registrar lote
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Definí actividad, ANP, cantidad de entradas y descuento.
      </p>
      <div className="mt-6">
        <LoteCreateForm onCreated={onCreated} />
      </div>
    </div>
  );
}
