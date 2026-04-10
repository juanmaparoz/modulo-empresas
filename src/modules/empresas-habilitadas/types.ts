/** Empresa prestadora habilitada para operar en una o más ANP (prototipo). */
export type EmpresaHabilitada = {
  id: string;
  nombre: string;
  cuit: string;
  email: string;
  /** ISO date (YYYY-MM-DD) inicio de autorización para operar */
  autorizacionDesde: string;
  /** ISO date (YYYY-MM-DD) fin de autorización */
  autorizacionHasta: string;
  /** Referencias a áreas naturales donde puede operar */
  areasNaturalesIds: string[];
  creadoEn: number;
};

export type UsuarioEmpresa = {
  id: string;
  empresaId: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  /** @deprecated usar nombre + apellido */
  nombreCompleto?: string;
  email: string;
  habilitado: boolean;
  /** Hash simple de la contraseña (prototipo; en producción usaría bcrypt). */
  passwordHash: string;
  creadoEn: number;
  actualizadoEn: number;
};

export type EmpresaHabilitadaInput = Omit<
  EmpresaHabilitada,
  "id" | "creadoEn"
>;

export type UsuarioEmpresaInput = Omit<
  UsuarioEmpresa,
  "id" | "creadoEn" | "actualizadoEn" | "nombreCompleto"
>;
