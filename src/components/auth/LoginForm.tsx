"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import {
  DEV_QUICK_ACCESS,
  getDevPreset,
  resolvePresetFromCredentials,
} from "@/constants/dev-auth";
import {
  ensureDevEmpresaForCompanyPreset,
  findEmpresaIdByContactEmail,
  getUsuarioByEmail,
} from "@/modules/empresas-habilitadas";
import { getAdminByEmail } from "@/modules/admins";
import { verifyPassword } from "@/lib/auth/password";
import { writeSession } from "@/lib/auth/client-session";
import type { UserRole } from "@/types/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applyQuickAccess = useCallback((r: UserRole) => {
    const preset = getDevPreset(r);
    if (!preset) return;
    setEmail(preset.email);
    setPassword(preset.password);
    setError(null);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const preset = resolvePresetFromCredentials(email, password);
      if (preset) {
        let empresaId: string | undefined;
        if (preset.id === "user_companie") {
          ensureDevEmpresaForCompanyPreset();
          empresaId = findEmpresaIdByContactEmail(preset.email) ?? undefined;
          if (!empresaId) {
            setError(
              "No hay una empresa registrada con este correo de contacto. Pedí al administrador ANP que dé de alta la empresa con tu mismo email.",
            );
            return;
          }
        }

        writeSession({
          email: preset.email,
          role: preset.id,
          issuedAt: Date.now(),
          ...(empresaId ? { empresaId } : {}),
        });

        if (preset.id === "super_admin") {
          router.replace("/super");
        } else if (preset.id === "admin_anp") {
          router.replace("/admin");
        } else {
          router.replace("/empresa");
        }
        return;
      }

      const admin = getAdminByEmail(email);
      if (admin) {
        if (!admin.habilitado) {
          setError("Tu cuenta de administrador está deshabilitada.");
          return;
        }
        const validAdmin = await verifyPassword(password, admin.passwordHash);
        if (!validAdmin) {
          setError("Correo o contraseña incorrectos.");
          return;
        }
        writeSession({
          email: admin.email,
          role: "admin_anp",
          issuedAt: Date.now(),
        });
        router.replace("/admin");
        return;
      }

      const usuario = getUsuarioByEmail(email);
      if (!usuario) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      if (!usuario.passwordHash) {
        setError(
          "Tu cuenta no tiene contraseña configurada. Contactá al administrador.",
        );
        return;
      }

      const valid = await verifyPassword(password, usuario.passwordHash);
      if (!valid) {
        setError("Correo o contraseña incorrectos.");
        return;
      }

      writeSession({
        email: usuario.email,
        role: "user_companie",
        issuedAt: Date.now(),
        empresaId: usuario.empresaId,
      });
      router.replace("/empresa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-6"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-zinc-800">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          placeholder="nombre@empresa.gob.ar"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium text-zinc-800">
          Contraseña
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <Link
          href="/recuperar-password"
          className="text-center text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <div className="border-t border-zinc-200 pt-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
          Acceso rápido (desarrollo)
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {DEV_QUICK_ACCESS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyQuickAccess(preset.id)}
              className="flex flex-1 flex-col items-start rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-sm transition hover:border-zinc-300 hover:bg-white"
            >
              <span className="font-medium text-zinc-900">{preset.label}</span>
              <span className="mt-0.5 text-xs text-zinc-600">
                {preset.description}
              </span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
