"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth/client-session";
import type { AuthSession } from "@/types/auth";

export function RoleHome() {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  if (!session) {
    return null;
  }

  if (session.role === "super_admin") {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-zinc-700">
          Como Super Admin podés crear y gestionar administradores ANP del
          sistema.
        </p>
        <div className="mt-6">
          <Link
            href="/super/admins/listado"
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <span className="font-medium text-zinc-900">Administradores</span>
            <span className="mt-1 text-xs text-zinc-500">
              Listado y crear administradores ANP
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (session.role === "admin_anp") {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-zinc-700">
          Como administración ANP podés gestionar prestadores, lotes de entradas
          por área natural y políticas de descuento.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/empresas/listado"
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <span className="font-medium text-zinc-900">
              Empresas habilitadas
            </span>
            <span className="mt-1 text-xs text-zinc-500">
              Listado, registrar, staff y usuarios
            </span>
          </Link>
          <Link
            href="/admin/lotes/listado"
            className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <span className="font-medium text-zinc-900">Lotes de entradas</span>
            <span className="mt-1 text-xs text-zinc-500">
              Listado y registrar lotes por actividad
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm text-zinc-700">
        Comprá entradas por lote o individuales, y gestioná el personal que
        opera en tus ANP habilitados.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/empresa/entradas/comprar"
          className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
        >
          <span className="font-medium text-zinc-900">Entradas</span>
          <span className="mt-1 text-xs text-zinc-500">
            Comprar, asignar y ver asignadas
          </span>
        </Link>
        <Link
          href="/empresa/staff/listado"
          className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-sm"
        >
          <span className="font-medium text-zinc-900">Staff</span>
          <span className="mt-1 text-xs text-zinc-500">
            Listado y registrar personal
          </span>
        </Link>
      </div>
    </div>
  );
}
