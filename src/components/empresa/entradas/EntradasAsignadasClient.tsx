"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { nombreActividadPorId } from "@/modules/actividades";
import {
  listAsignacionesPorEmpresa,
  type AsignacionEntrada,
} from "@/modules/asignaciones-entradas";
import { nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  getCompra,
  listComprasPorEmpresa,
  type CompraEntradaEmpresa,
} from "@/modules/compras-empresa";
import { EntradaAsignadaDetalle } from "./EntradaAsignadaDetalle";

type Props = {
  empresaId: string;
};

function tipoCompraLabel(c: CompraEntradaEmpresa): string {
  if (c.tipo === "lote_completo") {
    return c.loteId ? "Compra por lote" : "Lote completo";
  }
  return "Compra personalizada";
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PersonaItem({ asignacion }: { asignacion: AsignacionEntrada }) {
  const [open, setOpen] = useState(false);
  const p = asignacion.persona;

  return (
    <li className="rounded-md border border-zinc-200 bg-white transition-all hover:border-indigo-200 hover:shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-50/30"
      >
        <ChevronIcon open={open} />
        <span className="font-semibold text-zinc-900">
          {p.nombre} {p.apellido}
        </span>
        <span className="text-zinc-300">·</span>
        <span className="font-medium text-zinc-600">{p.documento}</span>
        <span className="text-zinc-300">·</span>
        <span className="truncate text-zinc-500">{p.email}</span>
      </button>
      {open && (
        <div className="border-t border-zinc-100 px-3 pb-3">
          <div className="mt-2 text-sm text-zinc-600">
            <p>
              <span className="font-medium text-zinc-700">Teléfono:</span>{" "}
              {p.telefono}
            </p>
          </div>
          <EntradaAsignadaDetalle row={asignacion} />
        </div>
      )}
    </li>
  );
}

function ActividadSection({
  compra,
  asignaciones,
}: {
  compra: CompraEntradaEmpresa;
  asignaciones: AsignacionEntrada[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-lg border-l-4 border-l-indigo-500 border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-indigo-50/50"
      >
        <ChevronIcon open={open} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            {tipoCompraLabel(compra)}
          </p>
          <p className="mt-0.5 font-bold text-zinc-900">
            {nombreActividadPorId(compra.actividadId)} ·{" "}
            {nombreAreaPorId(compra.areaNaturalId)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {asignaciones.length} entrada{asignaciones.length !== 1 ? "s" : ""}
        </span>
      </button>
      {open && (
        <div className="border-t border-zinc-100 p-4 pt-3">
          <ul className="flex flex-col gap-2">
            {asignaciones.map((a) => (
              <PersonaItem key={a.id} asignacion={a} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function SinCompraSection({
  asignaciones,
}: {
  asignaciones: AsignacionEntrada[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-lg border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50/50 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-amber-100/50"
      >
        <ChevronIcon open={open} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-amber-950">
            Asignaciones sin compra asociada
          </p>
          <p className="text-xs text-amber-800">Datos locales huérfanos</p>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
          {asignaciones.length}
        </span>
      </button>
      {open && (
        <div className="border-t border-amber-200 p-4 pt-3">
          <ul className="flex flex-col gap-2">
            {asignaciones.map((a) => (
              <PersonaItem key={a.id} asignacion={a} />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function EntradasAsignadasClient({ empresaId }: Props) {
  const {
    comprasOrdenadas,
    asignacionesPorCompra,
    asignacionesSinCompra,
    total,
  } = useMemo(() => {
    const asignaciones = listAsignacionesPorEmpresa(empresaId);
    const porCompra = new Map<string, AsignacionEntrada[]>();
    for (const a of asignaciones) {
      const arr = porCompra.get(a.compraId) ?? [];
      arr.push(a);
      porCompra.set(a.compraId, arr);
    }
    const compras = listComprasPorEmpresa(empresaId);
    const conAsignaciones = compras.filter(
      (c) => (porCompra.get(c.id)?.length ?? 0) > 0,
    );
    const asignacionesSinCompra = asignaciones.filter(
      (a) => !getCompra(empresaId, a.compraId),
    );
    return {
      comprasOrdenadas: conAsignaciones,
      asignacionesPorCompra: porCompra,
      asignacionesSinCompra,
      total: asignaciones.length,
    };
  }, [empresaId]);

  if (total === 0 && asignacionesSinCompra.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-zinc-500">
          Todavía no hay entradas asignadas.
        </p>
        <Link
          href="/empresa/entradas/mis-compras"
          className="inline-flex h-9 w-fit items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Ir a asignar entradas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">


      {comprasOrdenadas.map((c) => {
        const lista = asignacionesPorCompra.get(c.id) ?? [];
        if (lista.length === 0) return null;

        return (
          <ActividadSection key={c.id} compra={c} asignaciones={lista} />
        );
      })}

      {asignacionesSinCompra.length > 0 && (
        <SinCompraSection asignaciones={asignacionesSinCompra} />
      )}

      <div className="border-t border-zinc-200 pt-6">
        <p className="text-sm text-zinc-600">¿Querés asignar más entradas?</p>
        <Link
          href="/empresa/entradas/mis-compras"
          className="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          Ir a Compras y asignar
        </Link>
      </div>
    </div>
  );
}
