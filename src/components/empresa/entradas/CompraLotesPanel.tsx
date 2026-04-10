"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { getActividad, nombreActividadPorId } from "@/modules/actividades";
import { nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  calcularFechaVencimiento,
  DIAS_ANTES_VENCIMIENTO,
  montoTotalLote,
  registrarCompra,
} from "@/modules/compras-empresa";
import { listLotes, type LoteEntradas } from "@/modules/lotes-anp";

type Props = {
  empresaId: string;
  areas: string[];
  onCompraRealizada?: () => void;
};

function formatArs(n: number): string {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  });
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function getMinFechaVisita(): string {
  const d = new Date();
  d.setDate(d.getDate() + DIAS_ANTES_VENCIMIENTO + 1);
  return d.toISOString().split("T")[0];
}

export function CompraLotesPanel({ empresaId, areas, onCompraRealizada }: Props) {
  const lotesVisibles = useMemo(() => {
    const set = new Set(areas);
    return listLotes().filter((l) => set.has(l.areaNaturalId));
  }, [areas]);

  const [fechaVisitaLote, setFechaVisitaLote] = useState<Record<string, string>>(
    {},
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);

  const refreshFeedback = useCallback((msg: string) => {
    setFeedback(msg);
    onCompraRealizada?.();
    window.setTimeout(() => {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
    window.setTimeout(() => setFeedback(null), 5000);
  }, [onCompraRealizada]);

  function handleComprarLote(lote: LoteEntradas) {
    const act = getActividad(lote.actividadId);
    if (!act) {
      refreshFeedback("Actividad del lote no encontrada.");
      return;
    }
    const monto = montoTotalLote(lote, act.precioBaseArs);
    const fechaVisita = fechaVisitaLote[lote.id] || null;

    registrarCompra({
      empresaId,
      tipo: "lote_completo",
      actividadId: lote.actividadId,
      areaNaturalId: lote.areaNaturalId,
      loteId: lote.id,
      cantidadEntradas: lote.cantidadEntradas,
      precioBaseUnitarioArs: act.precioBaseArs,
      descuentoPorcentajeAplicado: lote.descuentoPorcentaje,
      montoTotalArs: monto,
      fechaVisita,
    });

    setFechaVisitaLote((prev) => ({ ...prev, [lote.id]: "" }));

    const fechaMsg = fechaVisita
      ? ` para el ${formatDate(fechaVisita)} (cargar datos hasta ${formatDate(calcularFechaVencimiento(fechaVisita))})`
      : " sin fecha definida";

    refreshFeedback(
      `Compra de lote registrada: ${lote.cantidadEntradas} entradas, total ${formatArs(monto)}${fechaMsg}.`,
    );
  }

  const minFechaVisita = getMinFechaVisita();

  if (lotesVisibles.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-500">
          No hay lotes disponibles en tus áreas habilitadas. El administrador
          puede cargarlos en Administración → Lotes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {feedback ? (
        <p
          ref={feedbackRef}
          className="w-full max-w-4xl rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900"
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      <ul className="flex w-full max-w-4xl flex-col gap-3">
        {lotesVisibles.map((lote) => {
          const act = getActividad(lote.actividadId);
          const monto =
            act != null ? montoTotalLote(lote, act.precioBaseArs) : null;
          const fechaLote = fechaVisitaLote[lote.id] || "";

          return (
            <li
              key={lote.id}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-all hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-zinc-900">
                    {nombreActividadPorId(lote.actividadId)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {nombreAreaPorId(lote.areaNaturalId)} ·{" "}
                    {lote.cantidadEntradas} entradas
                    {lote.descuentoPorcentaje > 0
                      ? ` · Descuento lote ${lote.descuentoPorcentaje}%`
                      : " · Sin descuento en lote"}
                  </p>
                  {monto != null && act != null ? (
                    <p className="mt-1 text-sm text-zinc-700">
                      Total estimado:{" "}
                      <span className="font-bold tabular-nums text-indigo-700">
                        {formatArs(monto)}
                      </span>{" "}
                      <span className="text-zinc-500">
                        (base {formatArs(act.precioBaseArs)} / entrada)
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-amber-800">
                      Actividad no encontrada en catálogo; revisá la
                      configuración.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-zinc-100 pt-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs font-medium text-zinc-700"
                    htmlFor={`fecha-lote-${lote.id}`}
                  >
                    Fecha de visita (opcional)
                  </label>
                  <input
                    id={`fecha-lote-${lote.id}`}
                    type="date"
                    min={minFechaVisita}
                    value={fechaLote}
                    onChange={(e) =>
                      setFechaVisitaLote((prev) => ({
                        ...prev,
                        [lote.id]: e.target.value,
                      }))
                    }
                    className="w-44 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
                  />
                  {fechaLote ? (
                    <p className="text-xs text-zinc-500">
                      Cargar datos hasta:{" "}
                      {formatDate(calcularFechaVencimiento(fechaLote))}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-400">
                      Sin fecha = sin vencimiento para cargar datos
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  disabled={monto == null || act == null}
                  onClick={() => handleComprarLote(lote)}
                  className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Comprar este lote
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
