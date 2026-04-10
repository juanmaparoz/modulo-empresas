"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AREAS_NATURALES_PROTOTIPO,
} from "@/modules/empresas-habilitadas";
import { listActividadesPorArea } from "@/modules/actividades";
import { createLote } from "@/modules/lotes-anp";

type Props = {
  onCreated: () => void;
};

export function LoteCreateForm({ onCreated }: Props) {
  const [areaNaturalId, setAreaNaturalId] = useState(
    AREAS_NATURALES_PROTOTIPO[0]?.id ?? "",
  );

  const actividades = useMemo(
    () => listActividadesPorArea(areaNaturalId),
    [areaNaturalId],
  );

  const [actividadId, setActividadId] = useState(
    () => actividades[0]?.id ?? "",
  );

  useEffect(() => {
    const first = listActividadesPorArea(areaNaturalId)[0]?.id ?? "";
    setActividadId(first);
  }, [areaNaturalId]);

  const [cantidad, setCantidad] = useState<string>("100");
  const [descuento, setDescuento] = useState<string>("0");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const n = Number.parseInt(cantidad, 10);
    if (!Number.isFinite(n) || n < 1) {
      setError("La cantidad de entradas debe ser un entero mayor o igual a 1.");
      return;
    }

    const d = Number.parseFloat(descuento.replace(",", "."));
    if (!Number.isFinite(d) || d < 0 || d > 100) {
      setError("El descuento debe estar entre 0 y 100 %.");
      return;
    }

    if (!areaNaturalId) {
      setError("Seleccioná un área natural.");
      return;
    }

    const validAnp = AREAS_NATURALES_PROTOTIPO.some((a) => a.id === areaNaturalId);
    if (!validAnp) {
      setError("Área natural no válida.");
      return;
    }

    const actOk = actividades.some((a) => a.id === actividadId);
    if (!actividadId || !actOk) {
      setError("Seleccioná una actividad asociada a esa área natural.");
      return;
    }

    createLote({
      areaNaturalId,
      actividadId,
      cantidadEntradas: n,
      descuentoPorcentaje: Math.round(d * 100) / 100,
    });
    setCantidad("100");
    setDescuento("0");
    setError(null);
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-4xl gap-4 rounded-lg border border-zinc-300 bg-white p-6 shadow-lg lg:p-8"
      noValidate
    >
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="anp">
          Área natural protegida
        </label>
        <select
          id="anp"
          value={areaNaturalId}
          onChange={(ev) => setAreaNaturalId(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        >
          {AREAS_NATURALES_PROTOTIPO.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="actividad">
          Actividad
        </label>
        <select
          id="actividad"
          value={actividadId}
          onChange={(ev) => setActividadId(ev.target.value)}
          disabled={actividades.length === 0}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 disabled:bg-zinc-100"
        >
          {actividades.length === 0 ? (
            <option value="">Sin actividades en catálogo</option>
          ) : (
            actividades.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))
          )}
        </select>
        <p className="mt-1 text-xs text-zinc-500">
          El lote aplica a una actividad concreta dentro del ANP (modelo v0.1).
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="cantidad">
          Cantidad de entradas del lote
        </label>
        <input
          id="cantidad"
          type="number"
          min={1}
          step={1}
          required
          value={cantidad}
          onChange={(ev) => setCantidad(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="desc">
          Descuento (%)
        </label>
        <input
          id="desc"
          type="number"
          min={0}
          max={100}
          step={0.01}
          value={descuento}
          onChange={(ev) => setDescuento(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Usá 0 si el lote no tiene descuento.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Crear lote
        </button>
      </div>
    </form>
  );
}
