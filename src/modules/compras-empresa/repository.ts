import type { CompraEntradaEmpresa, CompraEntradaEmpresaInput } from "./types";
import { STORAGE_COMPRAS_EMPRESA } from "./storage-keys";
import { calcularFechaVencimiento } from "./config";

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type LegacyCompra = Omit<CompraEntradaEmpresa, "fechaVisita" | "fechaVencimientoCarga"> & {
  fechaVisita?: string | null;
  fechaVencimientoCarga?: string | null;
};

function normalizeCompra(raw: unknown): CompraEntradaEmpresa | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as LegacyCompra;
  if (typeof o.id !== "string" || typeof o.empresaId !== "string") {
    return null;
  }
  return {
    id: o.id,
    empresaId: o.empresaId,
    tipo: o.tipo,
    actividadId: o.actividadId,
    areaNaturalId: o.areaNaturalId,
    loteId: o.loteId,
    cantidadEntradas: o.cantidadEntradas,
    precioBaseUnitarioArs: o.precioBaseUnitarioArs,
    descuentoPorcentajeAplicado: o.descuentoPorcentajeAplicado,
    montoTotalArs: o.montoTotalArs,
    fechaVisita: o.fechaVisita ?? null,
    fechaVencimientoCarga: o.fechaVencimientoCarga ?? null,
    creadoEn: o.creadoEn,
  };
}

function loadAll(): CompraEntradaEmpresa[] {
  if (typeof window === "undefined") return [];
  const raw = parseJson<unknown[]>(
    window.localStorage.getItem(STORAGE_COMPRAS_EMPRESA),
    [],
  );
  const out: CompraEntradaEmpresa[] = [];
  let dirty = false;
  for (const item of raw) {
    const n = normalizeCompra(item);
    if (!n) continue;
    out.push(n);
    if (
      item &&
      typeof item === "object" &&
      (!("fechaVisita" in item) || !("fechaVencimientoCarga" in item))
    ) {
      dirty = true;
    }
  }
  if (dirty) {
    saveAll(out);
  }
  return out;
}

function saveAll(list: CompraEntradaEmpresa[]): void {
  window.localStorage.setItem(STORAGE_COMPRAS_EMPRESA, JSON.stringify(list));
}

export function listComprasPorEmpresa(
  empresaId: string,
): CompraEntradaEmpresa[] {
  return loadAll()
    .filter((c) => c.empresaId === empresaId)
    .sort((a, b) => b.creadoEn - a.creadoEn);
}

export function getCompra(
  empresaId: string,
  compraId: string,
): CompraEntradaEmpresa | undefined {
  const c = loadAll().find((x) => x.id === compraId);
  if (!c || c.empresaId !== empresaId) return undefined;
  return c;
}

export function registrarCompra(
  input: CompraEntradaEmpresaInput,
): CompraEntradaEmpresa {
  const list = loadAll();

  const fechaVencimientoCarga = input.fechaVisita
    ? calcularFechaVencimiento(input.fechaVisita)
    : null;

  const row: CompraEntradaEmpresa = {
    ...input,
    fechaVencimientoCarga,
    id: crypto.randomUUID(),
    creadoEn: Date.now(),
  };
  list.push(row);
  saveAll(list);
  return row;
}

/** Determina el estado de una compra respecto al vencimiento. */
export type EstadoCompra = "sin_fecha" | "activa" | "por_vencer" | "vencida";

export function getEstadoCompra(compra: CompraEntradaEmpresa): EstadoCompra {
  if (!compra.fechaVisita || !compra.fechaVencimientoCarga) {
    return "sin_fecha";
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(compra.fechaVencimientoCarga + "T00:00:00");
  const fechaVisita = new Date(compra.fechaVisita + "T00:00:00");

  if (hoy > vencimiento) {
    return "vencida";
  }

  const diffDias = Math.ceil(
    (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDias <= 2) {
    return "por_vencer";
  }

  return "activa";
}

export function getDiasRestantes(compra: CompraEntradaEmpresa): number | null {
  if (!compra.fechaVencimientoCarga) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const vencimiento = new Date(compra.fechaVencimientoCarga + "T00:00:00");

  return Math.ceil(
    (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
  );
}
