"use client";

import { ListadoLotesClient } from "./ListadoLotesClient";

export function ListadoLotesPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Listado de lotes
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Lotes por actividad y ANP con descuento opcional.
      </p>
      <div className="mt-6">
        <ListadoLotesClient />
      </div>
    </div>
  );
}
