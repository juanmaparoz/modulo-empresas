"use client";

import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth/client-session";
import { getEmpresa } from "@/modules/empresas-habilitadas";
import { UserMenu } from "./UserMenu";

type Props = {
  fallbackTitle?: string;
  onMenuClick: () => void;
};

export function AppShellHeader({ fallbackTitle, onMenuClick }: Props) {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    if (!session) {
      setTitle(fallbackTitle ?? null);
      return;
    }

    if (session.role === "super_admin") {
      setTitle("Super Admin");
      return;
    }

    if (session.role === "admin_anp") {
      setTitle("Administración ANP");
      return;
    }

    if (session.role === "user_companie" && session.empresaId) {
      const empresa = getEmpresa(session.empresaId);
      if (empresa) {
        setTitle(empresa.nombre);
        return;
      }
    }

    setTitle(fallbackTitle ?? "Portal");
  }, [fallbackTitle]);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {title ? (
          <h1 className="text-sm font-semibold text-zinc-900">{title}</h1>
        ) : null}
      </div>
      <UserMenu />
    </header>
  );
}
