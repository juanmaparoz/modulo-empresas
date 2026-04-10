import {
  ACTIVIDADES_PROTOTIPO,
  primeraActividadPorArea,
} from "@/modules/actividades";
import type { StaffMiembro, StaffMiembroInput, StaffRolCumplimiento } from "./types";
import { STORAGE_STAFF_EMPRESA } from "./storage-keys";

function parseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type LegacyStaffRow = {
  id: string;
  empresaId: string;
  nombreCompleto: string;
  documento: string;
  email: string;
  telefono: string;
  rol: StaffRolCumplimiento;
  habilitado: boolean;
  creadoEn: number;
  actualizadoEn: number;
  canonAnualPagadoPorAnp?: Record<string, boolean>;
  areaNaturalId?: string;
  actividadId?: string;
  confirmadoPorAdmin?: boolean;
};

function normalizeStaff(raw: unknown): StaffMiembro | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as LegacyStaffRow;
  if (typeof o.id !== "string" || typeof o.empresaId !== "string") {
    return null;
  }

  const base = {
    id: o.id,
    empresaId: o.empresaId,
    nombreCompleto: String(o.nombreCompleto ?? ""),
    documento: String(o.documento ?? ""),
    email: String(o.email ?? ""),
    telefono: String(o.telefono ?? ""),
    rol: (o.rol === "arriero" ? "arriero" : "guia_montana") as StaffRolCumplimiento,
    habilitado: Boolean(o.habilitado),
    creadoEn: typeof o.creadoEn === "number" ? o.creadoEn : Date.now(),
    actualizadoEn: typeof o.actualizadoEn === "number" ? o.actualizadoEn : Date.now(),
  };

  if (
    typeof o.areaNaturalId === "string" &&
    o.areaNaturalId &&
    typeof o.actividadId === "string" &&
    o.actividadId
  ) {
    return {
      ...base,
      areaNaturalId: o.areaNaturalId,
      actividadId: o.actividadId,
      confirmadoPorAdmin:
        typeof o.confirmadoPorAdmin === "boolean"
          ? o.confirmadoPorAdmin
          : false,
    };
  }

  const canon = o.canonAnualPagadoPorAnp ?? {};
  const keys = Object.keys(canon);
  const areaNaturalId =
    keys.find((id) => canon[id]) ?? keys[0] ?? ACTIVIDADES_PROTOTIPO[0].areaNaturalId;
  const actividadId =
    primeraActividadPorArea(areaNaturalId)?.id ?? ACTIVIDADES_PROTOTIPO[0].id;

  return {
    ...base,
    areaNaturalId,
    actividadId,
    confirmadoPorAdmin: true,
  };
}

function loadAll(): StaffMiembro[] {
  if (typeof window === "undefined") return [];
  const raw = parseJson<unknown[]>(
    window.localStorage.getItem(STORAGE_STAFF_EMPRESA),
    [],
  );
  const out: StaffMiembro[] = [];
  let dirty = false;
  for (const item of raw) {
    const n = normalizeStaff(item);
    if (!n) continue;
    out.push(n);
    if (
      item &&
      typeof item === "object" &&
      "canonAnualPagadoPorAnp" in item
    ) {
      dirty = true;
    }
  }
  if (dirty) {
    saveAll(out);
  }
  return out;
}

function saveAll(list: StaffMiembro[]): void {
  window.localStorage.setItem(STORAGE_STAFF_EMPRESA, JSON.stringify(list));
}

export function listStaffPorEmpresa(empresaId: string): StaffMiembro[] {
  return loadAll()
    .filter((s) => s.empresaId === empresaId)
    .sort((a, b) => b.creadoEn - a.creadoEn);
}

export function createStaff(input: StaffMiembroInput): StaffMiembro {
  const list = loadAll();
  const now = Date.now();
  const row: StaffMiembro = {
    ...input,
    id: crypto.randomUUID(),
    creadoEn: now,
    actualizadoEn: now,
  };
  list.push(row);
  saveAll(list);
  return row;
}

export function updateStaffHabilitado(
  empresaId: string,
  staffId: string,
  habilitado: boolean,
): StaffMiembro | undefined {
  const list = loadAll();
  const i = list.findIndex(
    (s) => s.empresaId === empresaId && s.id === staffId,
  );
  if (i < 0) return undefined;
  const now = Date.now();
  list[i] = {
    ...list[i],
    habilitado,
    actualizadoEn: now,
  };
  saveAll(list);
  return list[i];
}

export function updateStaffConfirmacionPorAdmin(
  empresaId: string,
  staffId: string,
  confirmadoPorAdmin: boolean,
): StaffMiembro | undefined {
  const list = loadAll();
  const i = list.findIndex(
    (s) => s.empresaId === empresaId && s.id === staffId,
  );
  if (i < 0) return undefined;
  const now = Date.now();
  list[i] = {
    ...list[i],
    confirmadoPorAdmin,
    actualizadoEn: now,
  };
  saveAll(list);
  return list[i];
}
