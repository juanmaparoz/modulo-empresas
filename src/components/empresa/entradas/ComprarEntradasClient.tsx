"use client";

import { useMemo, useState } from "react";
import { getEmpresa } from "@/modules/empresas-habilitadas";
import { listComprasPorEmpresa } from "@/modules/compras-empresa";
import { CompraLotesPanel } from "./CompraLotesPanel";
import { CompraPersonalizadaPanel } from "./CompraPersonalizadaPanel";

type Props = {
  empresaId: string;
};

type Tab = "lotes" | "personalizada";

export function ComprarEntradasClient({ empresaId }: Props) {
  const empresa = useMemo(() => getEmpresa(empresaId), [empresaId]);
  const areas = empresa?.areasNaturalesIds ?? [];

  const [activeTab, setActiveTab] = useState<Tab>("lotes");
  const [comprasTick, setComprasTick] = useState(0);

  const totalCompras = useMemo(
    () => listComprasPorEmpresa(empresaId).length,
    [empresaId, comprasTick],
  );

  const handleCompraRealizada = () => {
    setComprasTick((t) => t + 1);
  };

  if (!empresa) {
    return (
      <p className="text-sm text-red-700">
        No se encontró la empresa. Volvé a iniciar sesión.
      </p>
    );
  }

  if (areas.length === 0) {
    return (
      <p className="text-sm text-amber-900">
        Tu empresa no tiene áreas naturales habilitadas. Contactá al
        administrador ANP.
      </p>
    );
  }

  const tabButtonClass = (tab: Tab) =>
    tab === activeTab
      ? "inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white"
      : "inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:border-indigo-300 hover:bg-indigo-50";

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex gap-2 border-b border-zinc-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("lotes")}
          className={tabButtonClass("lotes")}
        >
          Por lote
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("personalizada")}
          className={tabButtonClass("personalizada")}
        >
          Personalizada
        </button>
      </nav>

      <div>
        {activeTab === "lotes" ? (
          <CompraLotesPanel
            empresaId={empresaId}
            areas={areas}
            onCompraRealizada={handleCompraRealizada}
          />
        ) : (
          <CompraPersonalizadaPanel
            empresaId={empresaId}
            areas={areas}
            onCompraRealizada={handleCompraRealizada}
          />
        )}
      </div>

      <section
        aria-labelledby="resumen"
        className="border-t border-zinc-200 pt-4"
      >
        <h2 id="resumen" className="sr-only">
          Resumen
        </h2>
        <p className="text-xs text-zinc-500">
          Compras registradas: <span className="font-semibold">{totalCompras}</span>
        </p>
      </section>
    </div>
  );
}
