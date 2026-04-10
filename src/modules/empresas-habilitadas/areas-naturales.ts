/** Catálogo mínimo para el prototipo (selector multi ANP). */
export type AreaNatural = {
  id: string;
  nombre: string;
};

export const AREAS_NATURALES_PROTOTIPO: readonly AreaNatural[] = [
  {
    id: "anp-ppa",
    nombre: "Parque Provincial Aconcagua",
  },
  {
    id: "anp-laguna-diamante",
    nombre: "Reserva Laguna Diamante",
  },
  {
    id: "anp-valle-hermoso",
    nombre: "Reserva Valle Hermoso",
  },
] as const;

export function nombreAreaPorId(id: string): string {
  return AREAS_NATURALES_PROTOTIPO.find((a) => a.id === id)?.nombre ?? id;
}
