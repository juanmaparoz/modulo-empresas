/** Actividad ofrecida dentro de un área natural (prototipo; alineado a ACTIVITIES en modelo v0.1). */
export type Actividad = {
  id: string;
  areaNaturalId: string;
  nombre: string;
  /** Precio de referencia por entrada en ARS (prototipo). */
  precioBaseArs: number;
};

export const ACTIVIDADES_PROTOTIPO: readonly Actividad[] = [
  {
    id: "act-ppa-trek",
    areaNaturalId: "anp-ppa",
    nombre: "Trekking y circuitos base",
    precioBaseArs: 12000,
  },
  {
    id: "act-ppa-alta",
    areaNaturalId: "anp-ppa",
    nombre: "Actividad de montaña alta",
    precioBaseArs: 28000,
  },
  {
    id: "act-ld-laguna",
    areaNaturalId: "anp-laguna-diamante",
    nombre: "Recorrido laguna y miradores",
    precioBaseArs: 8500,
  },
  {
    id: "act-vh-inter",
    areaNaturalId: "anp-valle-hermoso",
    nombre: "Circuito interpretativo",
    precioBaseArs: 6500,
  },
] as const;

export function getActividad(id: string): Actividad | undefined {
  return ACTIVIDADES_PROTOTIPO.find((a) => a.id === id);
}

export function nombreActividadPorId(id: string): string {
  return getActividad(id)?.nombre ?? id;
}

export function listActividadesPorArea(areaNaturalId: string): Actividad[] {
  return ACTIVIDADES_PROTOTIPO.filter((a) => a.areaNaturalId === areaNaturalId);
}

export function listActividadesEnAreas(areaIds: readonly string[]): Actividad[] {
  const set = new Set(areaIds);
  return ACTIVIDADES_PROTOTIPO.filter((a) => set.has(a.areaNaturalId));
}

export function primeraActividadPorArea(
  areaNaturalId: string,
): Actividad | undefined {
  return listActividadesPorArea(areaNaturalId)[0];
}
