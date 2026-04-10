"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { readSession } from "@/lib/auth/client-session";
import {
  getUsuarioByEmail,
  updateUsuarioPassword,
} from "@/modules/empresas-habilitadas";
import {
  getAdminByEmail,
  updateAdminPassword,
} from "@/modules/admins";
import type { AuthSession } from "@/types/auth";

export function CambiarMiPasswordClient() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSession(readSession());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!session) {
      setError("No hay sesión activa.");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      if (session.role === "admin_anp") {
        const admin = getAdminByEmail(session.email);
        if (!admin) {
          setError("No se encontró tu cuenta de administrador.");
          return;
        }
        const validCurrent = await verifyPassword(currentPassword, admin.passwordHash);
        if (!validCurrent) {
          setError("La contraseña actual es incorrecta.");
          return;
        }
        const newHash = await hashPassword(newPassword);
        updateAdminPassword(admin.id, newHash);
      } else if (session.role === "user_companie") {
        const usuario = getUsuarioByEmail(session.email);
        if (!usuario) {
          setError("No se encontró tu cuenta.");
          return;
        }
        if (usuario.passwordHash) {
          const validCurrent = await verifyPassword(currentPassword, usuario.passwordHash);
          if (!validCurrent) {
            setError("La contraseña actual es incorrecta.");
            return;
          }
        }
        const newHash = await hashPassword(newPassword);
        updateUsuarioPassword(usuario.id, newHash);
      } else if (session.role === "super_admin") {
        setError("El Super Admin utiliza credenciales de desarrollo fijas.");
        return;
      } else {
        setError("El cambio de contraseña no está disponible para este tipo de cuenta.");
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return null;
  }

  if (success) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-base font-semibold text-zinc-900">
          Contraseña actualizada
        </h2>
        <p className="mt-2 text-sm text-emerald-800">
          Tu contraseña fue cambiada correctamente.
        </p>
        <div className="mt-4">
          <Link
            href="/perfil"
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Volver al perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h2 className="text-base font-semibold text-zinc-900">
        Cambiar contraseña
      </h2>
      <p className="mt-1 text-sm text-zinc-600">
        Ingresá tu contraseña actual y la nueva contraseña.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label
            htmlFor="current-pass"
            className="text-sm font-medium text-zinc-800"
          >
            Contraseña actual
          </label>
          <div className="mt-1">
            <PasswordInput
              id="current-pass"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="new-pass"
            className="text-sm font-medium text-zinc-800"
          >
            Nueva contraseña
          </label>
          <div className="mt-1">
            <PasswordInput
              id="new-pass"
              autoComplete="new-password"
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">Mínimo 6 caracteres.</p>
        </div>

        <div>
          <label
            htmlFor="confirm-pass"
            className="text-sm font-medium text-zinc-800"
          >
            Confirmar nueva contraseña
          </label>
          <div className="mt-1">
            <PasswordInput
              id="confirm-pass"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
          <Link
            href="/perfil"
            className="text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
