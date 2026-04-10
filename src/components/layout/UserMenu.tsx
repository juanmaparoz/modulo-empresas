"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearSession, readSession } from "@/lib/auth/client-session";
import { getAdminByEmail, getNombreCompletoAdmin } from "@/modules/admins";
import { getNombreCompletoUsuario, getUsuarioByEmail } from "@/modules/empresas-habilitadas";
import type { AuthSession } from "@/types/auth";

export function UserMenu() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = readSession();
    setSession(s);
    if (s) {
      if (s.role === "super_admin") {
        setUserName("Super Admin");
      } else if (s.role === "admin_anp") {
        const admin = getAdminByEmail(s.email);
        setUserName(admin ? getNombreCompletoAdmin(admin) : s.email.split("@")[0]);
      } else {
        const usuario = getUsuarioByEmail(s.email);
        setUserName(usuario ? getNombreCompletoUsuario(usuario) : s.email.split("@")[0]);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  function handleSignOut() {
    clearSession();
    router.replace("/login");
  }

  if (!session) {
    return null;
  }

  const roleLabel =
    session.role === "super_admin"
      ? "Super Admin"
      : session.role === "admin_anp"
        ? "Admin ANP"
        : "Empresa";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-zinc-100"
        aria-label="Menú de usuario"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </span>
        {userName ? (
          <span className="hidden text-sm font-medium text-zinc-700 sm:block">
            {userName}
          </span>
        ) : null}
        <svg
          className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-lg border border-zinc-200 bg-white py-2 shadow-lg transition-all duration-200 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="border-b border-zinc-100 px-4 pb-3">
          <p className="truncate text-sm font-medium text-zinc-900">
            {session.email}
          </p>
          <p className="text-xs text-zinc-500">{roleLabel}</p>
        </div>

        <div className="py-1">
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <svg
              className="h-4 w-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Editar perfil
          </Link>
          <Link
            href="/perfil/cambiar-password"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <svg
              className="h-4 w-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            Cambiar contraseña
          </Link>
        </div>

        <div className="border-t border-zinc-100 pt-1">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
