"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  getActividad,
  listActividadesEnAreas,
} from "@/modules/actividades";
import { nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  calcularFechaVencimiento,
  DIAS_ANTES_VENCIMIENTO,
  montoTotalIndividual,
  registrarCompra,
} from "@/modules/compras-empresa";

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

export function CompraPersonalizadaPanel({
  empresaId,
  areas,
  onCompraRealizada,
}: Props) {
  const actividadesDisponibles = useMemo(
    () => listActividadesEnAreas(areas),
    [areas],
  );

  const [actividadIndividual, setActividadIndividual] = useState(
    () => actividadesDisponibles[0]?.id ?? "",
  );
  const [cantidadIndividual, setCantidadIndividual] = useState("1");
  const [fechaVisitaIndividual, setFechaVisitaIndividual] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);

  const actividadSeleccionada = useMemo(
    () => getActividad(actividadIndividual),
    [actividadIndividual],
  );

  const cantidadNum = Number.parseInt(cantidadIndividual, 10) || 0;
  const montoEstimado = useMemo(() => {
    if (!actividadSeleccionada || cantidadNum < 1) return null;
    return montoTotalIndividual(cantidadNum, actividadSeleccionada.precioBaseArs);
  }, [actividadSeleccionada, cantidadNum]);

  const refreshFeedback = useCallback(
    (msg: string) => {
      setFeedback(msg);
      onCompraRealizada?.();
      window.setTimeout(() => {
        feedbackRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 50);
      window.setTimeout(() => setFeedback(null), 5000);
    },
    [onCompraRealizada],
  );

  function handleComprarIndividual(e: React.FormEvent) {
    e.preventDefault();
    const act = getActividad(actividadIndividual);
    if (!act || !areas.includes(act.areaNaturalId)) {
      setFeedback("Seleccioná una actividad válida para tu empresa.");
      return;
    }
    const n = Number.parseInt(cantidadIndividual, 10);
    if (!Number.isFinite(n) || n < 1) {
      setFeedback("La cantidad debe ser al menos 1.");
      return;
    }
    const monto = montoTotalIndividual(n, act.precioBaseArs);
    const fechaVisita = fechaVisitaIndividual || null;

    registrarCompra({
      empresaId,
      tipo: "individual",
      actividadId: act.id,
      areaNaturalId: act.areaNaturalId,
      cantidadEntradas: n,
      precioBaseUnitarioArs: act.precioBaseArs,
      descuentoPorcentajeAplicado: 0,
      montoTotalArs: monto,
      fechaVisita,
    });

    setFechaVisitaIndividual("");
    setCantidadIndividual("1");

    const fechaMsg = fechaVisita
      ? ` para el ${formatDate(fechaVisita)} (cargar datos hasta ${formatDate(calcularFechaVencimiento(fechaVisita))})`
      : " sin fecha definida";

    refreshFeedback(
      `Compra personalizada registrada: ${n} entrada(s), total ${formatArs(monto)}${fechaMsg}.`,
    );
  }

  const minFechaVisita = getMinFechaVisita();

  if (actividadesDisponibles.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-500">
          No hay actividades disponibles en tus áreas habilitadas.
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

      <form
        onSubmit={handleComprarIndividual}
        className="w-full max-w-4xl rounded-lg border border-zinc-200 bg-white p-6 shadow-lg"
      >
        <div className="flex flex-col gap-5">
          {/* Actividad */}
          <div>
            <label
              className="text-sm font-semibold text-zinc-800"
              htmlFor="act-ind"
            >
              Actividad
            </label>
            <select
              id="act-ind"
              value={actividadIndividual}
              onChange={(e) => setActividadIndividual(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            >
              {actividadesDisponibles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} — {nombreAreaPorId(a.areaNaturalId)}
                </option>
              ))}
            </select>
            {actividadSeleccionada && (
              <p className="mt-1 text-xs text-zinc-500">
                Precio: {formatArs(actividadSeleccionada.precioBaseArs)} por entrada
              </p>
            )}
          </div>

          {/* Cantidad y Fecha en la misma fila */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="text-sm font-semibold text-zinc-800"
                htmlFor="cant-ind"
              >
                Cantidad
              </label>
              <input
                id="cant-ind"
                type="number"
                min={1}
                step={1}
                value={cantidadIndividual}
                onChange={(e) => setCantidadIndividual(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label
                className="text-sm font-semibold text-zinc-800"
                htmlFor="fecha-ind"
              >
                Fecha de visita
              </label>
              <input
                id="fecha-ind"
                type="date"
                min={minFechaVisita}
                value={fechaVisitaIndividual}
                onChange={(e) => setFechaVisitaIndividual(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
              <p className="mt-1 text-xs text-zinc-400">
                {fechaVisitaIndividual
                  ? `Cargar datos hasta: ${formatDate(calcularFechaVencimiento(fechaVisitaIndividual))}`
                  : "Opcional"}
              </p>
            </div>
          </div>

          {/* Resumen y botón */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
            <div>
              {montoEstimado != null && (
                <>
                  <p className="text-xs text-zinc-500">Total estimado</p>
                  <p className="text-lg font-bold tabular-nums text-indigo-700">
                    {formatArs(montoEstimado)}
                  </p>
                </>
              )}
            </div>
            <button
              type="submit"
              disabled={cantidadNum < 1}
              className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Registrar compra
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
