import type { ReactNode } from "react";
import { SuperAdminsNav } from "@/components/super/SuperAdminsNav";

export default function SuperAdminsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-2 max-w-2xl">
        <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
          Gestión de administradores ANP
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          Creá y gestioná los usuarios que administran las áreas naturales
          protegidas.
        </p>
      </div>
      <SuperAdminsNav />
      {children}
    </div>
  );
}
