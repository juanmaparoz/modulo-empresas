"use client";

import Link from "next/link";
import { useState } from "react";
import { getUsuarioByEmail } from "@/modules/empresas-habilitadas";

export function RecuperarPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      setError("Ingresá tu correo.");
      return;
    }

    const usuario = getUsuarioByEmail(normalized);
    if (!usuario) {
      setError("No encontramos una cuenta con ese correo.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-emerald-800">
          Si el correo está registrado, recibirás instrucciones para restablecer
          tu contraseña (simulación en prototipo: usá el enlace de abajo).
        </p>
        <Link
          href={`/cambiar-password?email=${encodeURIComponent(email)}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Ir a cambiar contraseña (demo)
        </Link>
        <Link
          href="/login"
          className="text-center text-sm text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline"
        >
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="rec-email" className="text-sm font-medium text-zinc-800">
          Correo
        </label>
        <input
          id="rec-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          placeholder="tu@correo.com"
          required
        />
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Enviar instrucciones
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
