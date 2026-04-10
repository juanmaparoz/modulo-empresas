"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getEmpresa,
  listEmpresas,
  nombreAreaPorId,
  type EmpresaHabilitada,
} from "@/modules/empresas-habilitadas";
import { EmpresaUsuariosPanel } from "./EmpresaUsuariosPanel";
import { EmpresaStaffPanel } from "./EmpresaStaffPanel";

type Props = {
  empresaId: string;
};

type Tab = "staff" | "usuarios";
export function EmpresaDetalleView({ empresaId }: Props) {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<EmpresaHabilitada[] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("staff");

  useEffect(() => {
    setEmpresas(listEmpresas());
  }, [empresaId]);

  const empresa = useMemo(() => getEmpresa(empresaId), [empresaId]);

  useEffect(() => {
    const list = listEmpresas();
    if (list.length === 0) return;
    if (!getEmpresa(empresaId)) {
      router.replace(`/admin/empresas/${list[0].id}`);
    }
  }, [empresaId, router]);

  const handleEmpresaChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = e.target.value;
      if (!id) return;
      router.replace(`/admin/empresas/${id}`);
    },
    [router],
  );

  if (empresas === null) {
    return <p className="text-sm text-zinc-500">Cargando empresas…</p>;
  }

  if (empresas.length === 0) {
    return (
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">
          Detalle de empresa
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600">
          No hay empresas registradas todavía.{" "}
          <Link
            href="/admin/empresas/registrar"
            className="font-medium text-zinc-900 underline underline-offset-2"
          >
            Registrar una empresa
          </Link>
          .
        </p>
      </div>
    );
  }

  if (!empresa) {
    return <p className="text-sm text-zinc-500">Preparando vista…</p>;
  }

  const tabButtonClass = (tab: Tab) =>
    tab === activeTab
      ? "inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white"
      : "inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:border-indigo-300 hover:bg-indigo-50";

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">{empresa.nombre}</h1>
      <p className="mt-1 text-sm text-zinc-600">
        CUIT {empresa.cuit} · {empresa.email}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500">
        Áreas habilitadas:{" "}
        {empresa.areasNaturalesIds.map((id) => nombreAreaPorId(id)).join(", ")}
      </p>

      <div className="mt-4 max-w-sm">
        <label
          htmlFor="empresa-select"
          className="text-sm font-medium text-zinc-800"
        >
          Cambiar empresa
        </label>
        <select
          id="empresa-select"
          value={empresaId}
          onChange={handleEmpresaChange}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        >
          {empresas.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} — CUIT {e.cuit}
            </option>
          ))}
        </select>
      </div>

      <nav className="mt-6 flex gap-2 border-b border-zinc-200 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={tabButtonClass("staff")}
        >
          Staff
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("usuarios")}
          className={tabButtonClass("usuarios")}
        >
          Usuarios
        </button>
      </nav>

      <div className="mt-6">
        {activeTab === "staff" ? (
          <EmpresaStaffPanel empresaId={empresaId} />
        ) : (
          <EmpresaUsuariosPanel empresaId={empresaId} />
        )}
      </div>
    </div>
  );
}
