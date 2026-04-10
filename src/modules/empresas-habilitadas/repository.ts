import { hashPasswordSync } from "@/lib/auth/password";
import type {
  EmpresaHabilitada,
  EmpresaHabilitadaInput,
  UsuarioEmpresa,
  UsuarioEmpresaInput,
} from "./types";
import { STORAGE_EMPRESAS, STORAGE_USUARIOS_EMPRESA } from "./storage-keys";

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadEmpresas(): EmpresaHabilitada[] {
  if (typeof window === "undefined") return [];
  return parseJson<EmpresaHabilitada[]>(
    window.localStorage.getItem(STORAGE_EMPRESAS),
    [],
  );
}
function saveEmpresas(list: EmpresaHabilitada[]): void {
  window.localStorage.setItem(STORAGE_EMPRESAS, JSON.stringify(list));
}

type LegacyUsuario = Partial<UsuarioEmpresa> & {
  id: string;
  empresaId: string;
};

function normalizeUsuario(raw: unknown): UsuarioEmpresa | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as LegacyUsuario;
  if (typeof o.id !== "string" || typeof o.empresaId !== "string") {
    return null;
  }
  
  // Migrar nombreCompleto a nombre + apellido si es necesario
  let nombre = o.nombre ?? "";
  let apellido = o.apellido ?? "";
  if (!nombre && !apellido && o.nombreCompleto) {
    const parts = o.nombreCompleto.trim().split(" ");
    nombre = parts[0] ?? "";
    apellido = parts.slice(1).join(" ") || "";
  }
  
  return {
    id: o.id,
    empresaId: o.empresaId,
    nombre,
    apellido,
    documento: o.documento ?? "",
    telefono: o.telefono ?? "",
    email: String(o.email ?? ""),
    habilitado: o.habilitado !== false,
    passwordHash: o.passwordHash ?? "",
    creadoEn: typeof o.creadoEn === "number" ? o.creadoEn : Date.now(),
    actualizadoEn:
      typeof o.actualizadoEn === "number" ? o.actualizadoEn : Date.now(),
  };
}

function loadUsuarios(): UsuarioEmpresa[] {
  if (typeof window === "undefined") return [];
  const raw = parseJson<unknown[]>(
    window.localStorage.getItem(STORAGE_USUARIOS_EMPRESA),
    [],
  );
  const out: UsuarioEmpresa[] = [];
  let dirty = false;
  for (const item of raw) {
    const n = normalizeUsuario(item);
    if (!n) continue;
    out.push(n);
    if (
      item &&
      typeof item === "object" &&
      (!("passwordHash" in item) || !("actualizadoEn" in item))
    ) {
      dirty = true;
    }
  }
  if (dirty) {
    saveUsuarios(out);
  }
  return out;
}

function saveUsuarios(list: UsuarioEmpresa[]): void {
  window.localStorage.setItem(STORAGE_USUARIOS_EMPRESA, JSON.stringify(list));
}

function ensureUsuariosForEmpresas(): void {
  const empresas = loadEmpresas();
  const usuarios = loadUsuarios();
  const emailsConUsuario = new Set(usuarios.map((u) => u.email.toLowerCase()));

  let dirty = false;

  for (const empresa of empresas) {
    const emailEmpresa = empresa.email.toLowerCase();
    if (emailsConUsuario.has(emailEmpresa)) continue;

    const now = Date.now();
    const row: UsuarioEmpresa = {
      id: crypto.randomUUID(),
      empresaId: empresa.id,
      nombre: "Usuario",
      apellido: empresa.nombre,
      documento: "",
      telefono: "",
      email: empresa.email,
      habilitado: true,
      passwordHash: hashPasswordSync("123456"),
      creadoEn: now,
      actualizadoEn: now,
    };
    usuarios.push(row);
    emailsConUsuario.add(emailEmpresa);
    dirty = true;
  }

  if (dirty) {
    saveUsuarios(usuarios);
  }
}

export function listEmpresas(): EmpresaHabilitada[] {
  ensureUsuariosForEmpresas();
  return loadEmpresas().sort((a, b) => b.creadoEn - a.creadoEn);
}

export function createEmpresa(input: EmpresaHabilitadaInput): EmpresaHabilitada {
  const list = loadEmpresas();
  const row: EmpresaHabilitada = {
    ...input,
    id: crypto.randomUUID(),
    creadoEn: Date.now(),
  };
  list.push(row);
  saveEmpresas(list);
  return row;
}

export function getEmpresa(id: string): EmpresaHabilitada | undefined {
  return loadEmpresas().find((e) => e.id === id);
}

/** Resuelve la empresa cuyo correo de contacto coincide (prototipo: vínculo usuario empresa). */
export function findEmpresaIdByContactEmail(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  const row = loadEmpresas().find((e) => e.email.toLowerCase() === normalized);
  return row?.id ?? null;
}

export function listUsuariosPorEmpresa(empresaId: string): UsuarioEmpresa[] {
  return loadUsuarios()
    .filter((u) => u.empresaId === empresaId)
    .sort((a, b) => b.creadoEn - a.creadoEn);
}

export function getUsuarioByEmail(email: string): UsuarioEmpresa | undefined {
  const normalized = email.trim().toLowerCase();
  return loadUsuarios().find((u) => u.email.toLowerCase() === normalized);
}

export function createUsuarioEmpresa(
  input: UsuarioEmpresaInput,
): UsuarioEmpresa {
  const list = loadUsuarios();
  const now = Date.now();
  const row: UsuarioEmpresa = {
    ...input,
    id: crypto.randomUUID(),
    creadoEn: now,
    actualizadoEn: now,
  };
  list.push(row);
  saveUsuarios(list);
  return row;
}

export function updateUsuarioPassword(
  userId: string,
  newPasswordHash: string,
): UsuarioEmpresa | undefined {
  const list = loadUsuarios();
  const i = list.findIndex((u) => u.id === userId);
  if (i < 0) return undefined;
  list[i] = {
    ...list[i],
    passwordHash: newPasswordHash,
    actualizadoEn: Date.now(),
  };
  saveUsuarios(list);
  return list[i];
}

export type UsuarioPerfilUpdate = {
  nombre?: string;
  apellido?: string;
  documento?: string;
  telefono?: string;
};

export function updateUsuarioPerfil(
  userId: string,
  updates: UsuarioPerfilUpdate,
): UsuarioEmpresa | undefined {
  const list = loadUsuarios();
  const i = list.findIndex((u) => u.id === userId);
  if (i < 0) return undefined;
  list[i] = {
    ...list[i],
    ...updates,
    actualizadoEn: Date.now(),
  };
  saveUsuarios(list);
  return list[i];
}

export function getUsuarioById(userId: string): UsuarioEmpresa | undefined {
  return loadUsuarios().find((u) => u.id === userId);
}

/** Helper para obtener nombre completo de un usuario */
export function getNombreCompletoUsuario(u: UsuarioEmpresa): string {
  if (u.nombre && u.apellido) {
    return `${u.nombre} ${u.apellido}`;
  }
  if (u.nombre) return u.nombre;
  if (u.apellido) return u.apellido;
  return u.email.split("@")[0];
}
