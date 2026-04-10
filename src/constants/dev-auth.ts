import type { UserRole } from "@/types/auth";

/** Solo prototipo: credenciales y etiquetas para acceso rápido. No usar en producción. */
export const AUTH_STORAGE_KEY = "sio.auth.session.v1";

export type DevQuickAccess = {
  id: UserRole;
  label: string;
  description: string;
  email: string;
  password: string;
};

export const DEV_QUICK_ACCESS: readonly DevQuickAccess[] = [
  {
    id: "super_admin",
    label: "Super Admin",
    description: "Rol super_admin — crea administradores ANP.",
    email: "super@sistema.local",
    password: "Super-demo-2026",
  },
  {
    id: "admin_anp",
    label: "Administración ANP",
    description: "Rol admin_anp — vista de administración del área natural.",
    email: "admin.anp@sistema.local",
    password: "Anp-demo-2026",
  },
  {
    id: "user_companie",
    label: "Empresa prestadora",
    description: "Rol user_companie — operación de la empresa.",
    email: "empresa.prestadora@sistema.local",
    password: "Empresa-demo-2026",
  },
] as const;

export function getDevPreset(role: UserRole): DevQuickAccess | undefined {
  return DEV_QUICK_ACCESS.find((p) => p.id === role);
}

/** Prototipo: infiere rol (y usuario de prueba) a partir de correo + contraseña. */
export function resolvePresetFromCredentials(
  email: string,
  password: string,
): DevQuickAccess | undefined {
  const normalized = email.trim().toLowerCase();
  return DEV_QUICK_ACCESS.find(
    (p) => p.email.toLowerCase() === normalized && p.password === password,
  );
}
