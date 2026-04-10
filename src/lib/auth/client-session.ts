"use client";

import { AUTH_STORAGE_KEY } from "@/constants/dev-auth";
import type { AuthSession } from "@/types/auth";

function parseSession(raw: string | null): AuthSession | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as AuthSession;
    if (
      typeof data.email !== "string" ||
      (data.role !== "super_admin" &&
        data.role !== "admin_anp" &&
        data.role !== "user_companie") ||
      typeof data.issuedAt !== "number"
    ) {
      return null;
    }
    if (
      data.empresaId !== undefined &&
      typeof data.empresaId !== "string"
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function readSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  return parseSession(window.localStorage.getItem(AUTH_STORAGE_KEY));
}

export function writeSession(session: AuthSession): void {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
