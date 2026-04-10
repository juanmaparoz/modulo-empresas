import { getCompra } from "@/modules/compras-empresa/repository";
import type { AsignacionEntrada, AsignacionEntradaInput } from "./types";
import { STORAGE_ASIGNACIONES_ENTRADA } from "./storage-keys";

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadAll(): AsignacionEntrada[] {
  if (typeof window === "undefined") return [];
  return parseJson<AsignacionEntrada[]>(
    window.localStorage.getItem(STORAGE_ASIGNACIONES_ENTRADA),
    [],
  );
}

function saveAll(list: AsignacionEntrada[]): void {
  window.localStorage.setItem(
    STORAGE_ASIGNACIONES_ENTRADA,
    JSON.stringify(list),
  );
}

export function listAsignacionesPorEmpresa(
  empresaId: string,
): AsignacionEntrada[] {
  return loadAll()
    .filter((a) => a.empresaId === empresaId)
    .sort((a, b) => b.creadoEn - a.creadoEn);
}

export function contarAsignacionesPorCompra(compraId: string): number {
  return loadAll().filter((a) => a.compraId === compraId).length;
}

export function crearAsignacion(input: AsignacionEntradaInput): AsignacionEntrada {
  const compra = getCompra(input.empresaId, input.compraId);
  if (!compra) {
    throw new Error("Compra no encontrada.");
  }
  if (
    compra.actividadId !== input.actividadId ||
    compra.areaNaturalId !== input.areaNaturalId
  ) {
    throw new Error("La asignación no coincide con la compra.");
  }
  const usados = contarAsignacionesPorCompra(input.compraId);
  if (usados >= compra.cantidadEntradas) {
    throw new Error("No hay entradas disponibles en esta compra.");
  }

  const list = loadAll();
  const row: AsignacionEntrada = {
    ...input,
    id: crypto.randomUUID(),
    creadoEn: Date.now(),
  };
  list.push(row);
  saveAll(list);
  return row;
}
