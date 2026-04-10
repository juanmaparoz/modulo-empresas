import { primeraActividadPorArea } from "@/modules/actividades";
import type { LoteEntradas, LoteEntradasInput } from "./types";
import { STORAGE_LOTES_ANP } from "./storage-keys";

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeLote(raw: unknown): LoteEntradas | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<LoteEntradas> & { areaNaturalId?: string };
  if (
    typeof r.id !== "string" ||
    typeof r.areaNaturalId !== "string" ||
    typeof r.cantidadEntradas !== "number" ||
    typeof r.descuentoPorcentaje !== "number" ||
    typeof r.creadoEn !== "number"
  ) {
    return null;
  }
  let actividadId = r.actividadId;
  if (typeof actividadId !== "string" || !actividadId) {
    const fallback = primeraActividadPorArea(r.areaNaturalId);
    actividadId = fallback?.id ?? "act-ppa-trek";
  }
  return {
    id: r.id,
    areaNaturalId: r.areaNaturalId,
    actividadId,
    cantidadEntradas: r.cantidadEntradas,
    descuentoPorcentaje: r.descuentoPorcentaje,
    creadoEn: r.creadoEn,
  };
}

function loadAll(): LoteEntradas[] {
  if (typeof window === "undefined") return [];
  const key = STORAGE_LOTES_ANP;
  const raw = parseJson<unknown[]>(window.localStorage.getItem(key), []);
  const normalized: LoteEntradas[] = [];
  for (const row of raw) {
    const n = normalizeLote(row);
    if (n) normalized.push(n);
  }
  const serialized = JSON.stringify(normalized);
  if (window.localStorage.getItem(key) !== serialized) {
    window.localStorage.setItem(key, serialized);
  }
  return normalized;
}

function saveAll(list: LoteEntradas[]): void {
  window.localStorage.setItem(STORAGE_LOTES_ANP, JSON.stringify(list));
}

export function listLotes(): LoteEntradas[] {
  return loadAll().sort((a, b) => b.creadoEn - a.creadoEn);
}

export function createLote(input: LoteEntradasInput): LoteEntradas {
  const list = loadAll();
  const row: LoteEntradas = {
    ...input,
    id: crypto.randomUUID(),
    creadoEn: Date.now(),
  };
  list.push(row);
  saveAll(list);
  return row;
}
