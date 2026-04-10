"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navButtonClass(active: boolean) {
  return active
    ? "inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white"
    : "inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50";
}

export function SuperAdminsNav() {
  const pathname = usePathname();
  const listado = pathname.includes("/admins/listado");
  const crear = pathname.includes("/admins/crear");

  return (
    <nav
      className="mb-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-6"
      aria-label="Secciones admins"
    >
      <Link href="/super/admins/listado" className={navButtonClass(listado)}>
        Listado
      </Link>
      <Link href="/super/admins/crear" className={navButtonClass(crear)}>
        Crear admin
      </Link>
    </nav>
  );
}
