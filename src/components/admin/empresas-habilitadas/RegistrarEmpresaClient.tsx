"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { EmpresaCreateForm } from "./EmpresaCreateForm";

export function RegistrarEmpresaClient() {
  const router = useRouter();

  const onCreated = useCallback(() => {
    router.push("/admin/empresas/listado");
  }, [router]);

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Registrar empresa
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Datos de la empresa, vigencia de autorización y ANP habilitadas.
      </p>
      <div className="mt-6">
        <EmpresaCreateForm onCreated={onCreated} />
      </div>
    </div>
  );
}
