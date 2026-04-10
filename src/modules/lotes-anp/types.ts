/** Lote de entradas asociado a una actividad dentro de un ANP (prototipo). */
export type LoteEntradas = {
  id: string;
  areaNaturalId: string;
  /** Actividad a la que aplica el lote (precio base y reglas de negocio). */
  actividadId: string;
  cantidadEntradas: number;
  /** 0 = sin descuento; 1–100 = porcentaje de descuento sobre el precio de referencia. */
  descuentoPorcentaje: number;
  creadoEn: number;
};

export type LoteEntradasInput = Omit<LoteEntradas, "id" | "creadoEn">;
