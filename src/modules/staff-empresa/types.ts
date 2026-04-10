/** Rol operativo del staff en terreno (prototipo). */
export type StaffRolCumplimiento = "guia_montana" | "arriero";

/** Personal de empresa vinculado a persona (datos mínimos en prototipo). */
export type StaffMiembro = {
  id: string;
  empresaId: string;
  nombreCompleto: string;
  /** DNI o pasaporte según corresponda */
  documento: string;
  email: string;
  telefono: string;
  rol: StaffRolCumplimiento;
  /** La empresa puede deshabilitar al empleado en el listado (sigue visible para el admin). */
  habilitado: boolean;
  /** Área natural donde opera (fijo desde el alta; no editable). */
  areaNaturalId: string;
  /** Actividad habilitada (fija desde el alta; no editable). */
  actividadId: string;
  /** El admin ANP confirma al personal dado de alta por la empresa. */
  confirmadoPorAdmin: boolean;
  creadoEn: number;
  actualizadoEn: number;
};

export type StaffMiembroInput = Omit<
  StaffMiembro,
  "id" | "creadoEn" | "actualizadoEn"
>;
