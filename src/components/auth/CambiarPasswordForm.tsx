"use client";

import Link from "next/link";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { hashPassword } from "@/lib/auth/password";
import {
  getUsuarioByEmail,
  updateUsuarioPassword,
} from "@/modules/empresas-habilitadas";

type Props = {
  initialEmail?: string;
};

export function CambiarPasswordForm({ initialEmail = "" }: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError("Ingresá tu correo.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const usuario = getUsuarioByEmail(normalized);
    if (!usuario) {
      setError("No encontramos una cuenta con ese correo.");
      return;
    }

    setLoading(true);
    try {
      const newHash = await hashPassword(password);
      updateUsuarioPassword(usuario.id, newHash);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-emerald-800">
          Tu contraseña fue actualizada correctamente.
        </p>
        <Link
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="chg-email" className="text-sm font-medium text-zinc-800">
          Correo
        </label>
        <input
          id="chg-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          required
        />
      </div>

      <div>
        <label htmlFor="chg-pass" className="text-sm font-medium text-zinc-800">
          Nueva contraseña
        </label>
        <div className="mt-1">
          <PasswordInput
            id="chg-pass"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="chg-confirm"
          className="text-sm font-medium text-zinc-800"
        >
          Confirmar contraseña
        </label>
        <div className="mt-1">
          <PasswordInput
            id="chg-confirm"
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

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60"
      >
        {loading ? "Guardando..." : "Cambiar contraseña"}
      </button>

      <Link
        href="/login"
        className="text-center text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
      >
        Volver al login
      </Link>
    </form>
  );
}
