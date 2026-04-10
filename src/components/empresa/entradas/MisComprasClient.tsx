"use client";

import { useMemo, useReducer, useState } from "react";
import { nombreActividadPorId } from "@/modules/actividades";
import { contarAsignacionesPorCompra } from "@/modules/asignaciones-entradas";
import { nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  getDiasRestantes,
  getEstadoCompra,
  listComprasPorEmpresa,
  type CompraEntradaEmpresa,
  type EstadoCompra,
} from "@/modules/compras-empresa";
import { AsignacionVisitanteForm } from "./AsignacionVisitanteForm";

type Props = {
  empresaId: string;
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

function tipoLabel(t: CompraEntradaEmpresa["tipo"]): string {
  return t === "lote_completo" ? "Lote completo" : "Individual";
}

function EstadoBadge({
  estado,
  diasRestantes,
}: {
  estado: EstadoCompra;
  diasRestantes: number | null;
}) {
  if (estado === "sin_fecha") {
    return (
      <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
        Sin fecha
      </span>
    );
  }

  if (estado === "vencida") {
    return (
      <span className="inline-flex rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
        Vencida
      </span>
    );
  }

  if (estado === "por_vencer") {
    return (
      <span className="inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
        Vence en {diasRestantes} día{diasRestantes !== 1 ? "s" : ""}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      Activa
    </span>
  );
}

export function MisComprasClient({ empresaId }: Props) {
  const [, refreshStats] = useReducer((n: number) => n + 1, 0);
  const [compraParaAsignar, setCompraParaAsignar] =
    useState<CompraEntradaEmpresa | null>(null);

  const compras = useMemo(
    () => listComprasPorEmpresa(empresaId),
    [empresaId],
  );

  const statsPorCompra = new Map<
    string,
    { total: number; asignadas: number; disponibles: number }
  >();
  for (const c of compras) {
    const asignadas = contarAsignacionesPorCompra(c.id);
    statsPorCompra.set(c.id, {
      total: c.cantidadEntradas,
      asignadas,
      disponibles: Math.max(0, c.cantidadEntradas - asignadas),
    });
  }

  function bump() {
    refreshStats();
  }

  return (
    <div className="flex flex-col gap-12">
      <section>
        {compras.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No hay compras registradas. Andá a Comprar para generar cupos.
          </p>
        ) : (
          <div className="mt-6 space-y-6">
            {compras.map((c) => {
              const st = statsPorCompra.get(c.id);
              const disponibles = st?.disponibles ?? 0;
              const asignadas = st?.asignadas ?? 0;
              const abierto = compraParaAsignar?.id === c.id;
              const estado = getEstadoCompra(c);
              const diasRestantes = getDiasRestantes(c);
              const puedeAsignar = disponibles > 0 && estado !== "vencida";

              return (
                <div
                  key={c.id}
                  className={`rounded-lg border-l-4 border bg-white p-4 shadow-sm ${
                    estado === "vencida"
                      ? "border-l-red-500 border-red-200 bg-red-50/30"
                      : estado === "por_vencer"
                        ? "border-l-amber-500 border-amber-200"
                        : "border-l-indigo-500 border-zinc-200"
                  }`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-zinc-900">
                          {nombreActividadPorId(c.actividadId)} ·{" "}
                          {nombreAreaPorId(c.areaNaturalId)}
                        </p>
                        <EstadoBadge
                          estado={estado}
                          diasRestantes={diasRestantes}
                        />
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">
                        {tipoLabel(c.tipo)} · {formatArs(c.montoTotalArs)}
                      </p>
                      {c.fechaVisita ? (
                        <p className="mt-1 text-xs text-zinc-600">
                          <span className="font-medium">Fecha de visita:</span>{" "}
                          {formatDate(c.fechaVisita)}
                          {c.fechaVencimientoCarga ? (
                            <span className="text-zinc-500">
                              {" "}
                              · Cargar datos hasta:{" "}
                              {formatDate(c.fechaVencimientoCarga)}
                            </span>
                          ) : null}
                        </p>
                      ) : null}
                    </div>
                    <div className="text-sm tabular-nums text-zinc-800">
                      <span
                        className={`font-semibold ${
                          estado === "vencida" && disponibles > 0
                            ? "text-red-700"
                            : "text-emerald-700"
                        }`}
                      >
                        Disponibles: {disponibles}
                      </span>
                      <span className="mx-2 text-zinc-300">|</span>
                      <span className="font-medium text-zinc-700">
                        Asignadas: {asignadas}
                      </span>
                      <span className="mx-2 text-zinc-300">|</span>
                      <span className="text-zinc-500">
                        Total: {c.cantidadEntradas}
                      </span>
                    </div>
                  </div>

                  {puedeAsignar && !abierto ? (
                    <button
                      type="button"
                      onClick={() => setCompraParaAsignar(c)}
                      className="mt-3 inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
                    >
                      Asignar una entrada
                    </button>
                  ) : null}

                  {estado === "vencida" && disponibles > 0 ? (
                    <p className="mt-3 text-xs text-red-700">
                      El plazo para cargar datos venció. Las {disponibles}{" "}
                      entrada(s) sin asignar no pueden usarse.
                    </p>
                  ) : null}

                  {disponibles === 0 && estado !== "vencida" ? (
                    <p className="mt-3 text-xs text-zinc-500">
                      No quedan entradas sin asignar en esta compra.
                    </p>
                  ) : null}

                  {abierto ? (
                    <div className="mt-4">
                      <AsignacionVisitanteForm
                        empresaId={empresaId}
                        compra={c}
                        onAssigned={() => {
                          setCompraParaAsignar(null);
                          bump();
                        }}
                        onCancel={() => setCompraParaAsignar(null)}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
