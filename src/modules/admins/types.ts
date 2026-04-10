/** Usuario administrador ANP (creado por super_admin). */
export type AdminUser = {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  /** @deprecated usar nombre + apellido */
  nombreCompleto?: string;
  email: string;
  passwordHash: string;
  habilitado: boolean;
  creadoEn: number;
  actualizadoEn: number;
};

export type AdminUserInput = Omit<
  AdminUser,
  "id" | "creadoEn" | "actualizadoEn" | "nombreCompleto"
>;
