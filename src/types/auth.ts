/** Roles reconocidos en el prototipo (alineado a docs de producto). */
export type UserRole = "super_admin" | "admin_anp" | "user_companie";

export type AuthSession = {
  email: string;
  role: UserRole;
  issuedAt: number;
  /** Empresa vinculada (solo rol empresa; coincide con correo de contacto de la empresa). */
  empresaId?: string;
};
