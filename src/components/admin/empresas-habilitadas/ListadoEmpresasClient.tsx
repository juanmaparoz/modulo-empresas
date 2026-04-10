"use client";

import { useCallback, useEffect, useState } from "react";
import { listEmpresas, type EmpresaHabilitada } from "@/modules/empresas-habilitadas";
import { EmpresaListTable } from "./EmpresaListTable";

export function ListadoEmpresasClient() {
  const [empresas, setEmpresas] = useState<EmpresaHabilitada[]>([]);

  const refresh = useCallback(() => {
    setEmpresas(listEmpresas());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Listado de empresas
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Prestadores registrados con vigencia y áreas naturales habilitadas.
      </p>
      <div className="mt-6">
        <EmpresaListTable empresas={empresas} />
      </div>
    </div>
  );
}
