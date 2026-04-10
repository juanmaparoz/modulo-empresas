export type TipoCompraEntrada = "lote_completo" | "individual";

/** Compra simulada en prototipo (localStorage). */
export type CompraEntradaEmpresa = {
  id: string;
  empresaId: string;
  tipo: TipoCompraEntrada;
  actividadId: string;
  areaNaturalId: string;
  loteId?: string;
  cantidadEntradas: number;
  precioBaseUnitarioArs: number;
  descuentoPorcentajeAplicado: number;
  montoTotalArs: number;
  /** Fecha de visita programada (YYYY-MM-DD). Null si no se definió. */
  fechaVisita: string | null;
  /** Fecha límite para cargar datos de visitantes (YYYY-MM-DD). Null si no hay fechaVisita. */
  fechaVencimientoCarga: string | null;
  creadoEn: number;
};

export type CompraEntradaEmpresaInput = Omit<
  CompraEntradaEmpresa,
  "id" | "creadoEn" | "fechaVencimientoCarga"
> & {
  fechaVisita: string | null;
};
