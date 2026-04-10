import { DEV_QUICK_ACCESS } from "@/constants/dev-auth";
import { hashPasswordSync } from "@/lib/auth/password";
import type { AdminUser, AdminUserInput } from "./types";
import { STORAGE_ADMINS } from "./storage-keys";

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type LegacyAdmin = Partial<AdminUser> & {
  id: string;
  email: string;
};

function normalizeAdmin(raw: unknown): AdminUser | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as LegacyAdmin;
  if (typeof o.id !== "string" || typeof o.email !== "string") {
    return null;
  }

  let nombre = o.nombre ?? "";
  let apellido = o.apellido ?? "";
  if (!nombre && !apellido && o.nombreCompleto) {
    const parts = o.nombreCompleto.trim().split(" ");
    nombre = parts[0] ?? "";
    apellido = parts.slice(1).join(" ") || "";
  }

  return {
    id: o.id,
    nombre,
    apellido,
    documento: o.documento ?? "",
    telefono: o.telefono ?? "",
    email: o.email,
    passwordHash: o.passwordHash ?? "",
    habilitado: o.habilitado !== false,
    creadoEn: typeof o.creadoEn === "number" ? o.creadoEn : Date.now(),
    actualizadoEn:
      typeof o.actualizadoEn === "number" ? o.actualizadoEn : Date.now(),
  };
}

function loadAll(): AdminUser[] {
  if (typeof window === "undefined") return [];
  const raw = parseJson<unknown[]>(
    window.localStorage.getItem(STORAGE_ADMINS),
    [],
  );
  const out: AdminUser[] = [];
  let dirty = false;
  for (const item of raw) {
    const n = normalizeAdmin(item);
    if (!n) continue;
    out.push(n);
    if (item && typeof item === "object" && !("nombre" in item)) {
      dirty = true;
    }
  }
  if (dirty) {
    saveAll(out);
  }
  return out;
}

function saveAll(list: AdminUser[]): void {
  window.localStorage.setItem(STORAGE_ADMINS, JSON.stringify(list));
}

function ensureDevAdminExists(): void {
  const devAdmin = DEV_QUICK_ACCESS.find((p) => p.id === "admin_anp");
  if (!devAdmin) return;

  const list = loadAll();
  const exists = list.some(
    (a) => a.email.toLowerCase() === devAdmin.email.toLowerCase(),
  );
  if (exists) return;

  const now = Date.now();
  const row: AdminUser = {
    id: crypto.randomUUID(),
    nombre: "Admin",
    apellido: "ANP (desarrollo)",
    documento: "",
    telefono: "",
    email: devAdmin.email,
    passwordHash: hashPasswordSync(devAdmin.password),
    habilitado: true,
    creadoEn: now,
    actualizadoEn: now,
  };
  list.push(row);
  saveAll(list);
}

export function listAdmins(): AdminUser[] {
  ensureDevAdminExists();
  return loadAll().sort((a, b) => b.creadoEn - a.creadoEn);
}

export function getAdminByEmail(email: string): AdminUser | undefined {
  const normalized = email.trim().toLowerCase();
  return loadAll().find((a) => a.email.toLowerCase() === normalized);
}

export function getAdminById(adminId: string): AdminUser | undefined {
  return loadAll().find((a) => a.id === adminId);
}

export function createAdmin(input: AdminUserInput): AdminUser {
  const list = loadAll();
  const now = Date.now();
  const row: AdminUser = {
    ...input,
    id: crypto.randomUUID(),
    creadoEn: now,
    actualizadoEn: now,
  };
  list.push(row);
  saveAll(list);
  return row;
}

export function updateAdminHabilitado(
  adminId: string,
  habilitado: boolean,
): AdminUser | undefined {
  const list = loadAll();
  const i = list.findIndex((a) => a.id === adminId);
  if (i < 0) return undefined;
  list[i] = {
    ...list[i],
    habilitado,
    actualizadoEn: Date.now(),
  };
  saveAll(list);
  return list[i];
}

export function updateAdminPassword(
  adminId: string,
  newPasswordHash: string,
): AdminUser | undefined {
  const list = loadAll();
  const i = list.findIndex((a) => a.id === adminId);
  if (i < 0) return undefined;
  list[i] = {
    ...list[i],
    passwordHash: newPasswordHash,
    actualizadoEn: Date.now(),
  };
  saveAll(list);
  return list[i];
}

export type AdminPerfilUpdate = {
  nombre?: string;
  apellido?: string;
  documento?: string;
  telefono?: string;
};

export function updateAdminPerfil(
  adminId: string,
  updates: AdminPerfilUpdate,
): AdminUser | undefined {
  const list = loadAll();
  const i = list.findIndex((a) => a.id === adminId);
  if (i < 0) return undefined;
  list[i] = {
    ...list[i],
    ...updates,
    actualizadoEn: Date.now(),
  };
  saveAll(list);
  return list[i];
}

export function getNombreCompletoAdmin(a: AdminUser): string {
  if (a.nombre && a.apellido) {
    return `${a.nombre} ${a.apellido}`;
  }
  if (a.nombre) return a.nombre;
  if (a.apellido) return a.apellido;
  return a.email.split("@")[0];
}
