/** Días antes de la fecha de visita en que vence la carga de datos. */
export const DIAS_ANTES_VENCIMIENTO =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_DIAS_ANTES_VENCIMIENTO
    ? parseInt(process.env.NEXT_PUBLIC_DIAS_ANTES_VENCIMIENTO, 10)
    : 2;

/** Calcula la fecha de vencimiento para carga de datos. */
export function calcularFechaVencimiento(fechaVisita: string): string {
  const fecha = new Date(fechaVisita + "T00:00:00");
  fecha.setDate(fecha.getDate() - DIAS_ANTES_VENCIMIENTO);
  return fecha.toISOString().split("T")[0];
}
