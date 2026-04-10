import type { PreviousConditions } from "@/types/visitante-salud";

export type DatosSeguroVisitante = {
  aseguradora: string;
  numeroPoliza: string;
  /** ISO date YYYY-MM-DD */
  vigenciaDesde: string;
  /** ISO date YYYY-MM-DD */
  vigenciaHasta: string;
};

export type DatosPersonaVisitante = {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  seguro: DatosSeguroVisitante;
  salud: PreviousConditions;
};

export type AsignacionEntrada = {
  id: string;
  empresaId: string;
  compraId: string;
  actividadId: string;
  areaNaturalId: string;
  persona: DatosPersonaVisitante;
  creadoEn: number;
};

export type AsignacionEntradaInput = Omit<AsignacionEntrada, "id" | "creadoEn">;
