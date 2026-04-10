import type { LoteEntradas } from "@/modules/lotes-anp/types";

function roundArs(n: number): number {
  return Math.round(n * 100) / 100;
}

export function montoTotalLote(
  lote: LoteEntradas,
  precioBaseUnitarioArs: number,
): number {
  const bruto = lote.cantidadEntradas * precioBaseUnitarioArs;
  return roundArs(bruto * (1 - lote.descuentoPorcentaje / 100));
}

export function montoTotalIndividual(
  cantidad: number,
  precioBaseUnitarioArs: number,
): number {
  return roundArs(cantidad * precioBaseUnitarioArs);
}
