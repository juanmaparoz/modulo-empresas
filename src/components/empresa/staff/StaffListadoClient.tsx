"use client";

import { useMemo, useState } from "react";
import { nombreActividadPorId } from "@/modules/actividades";
import { nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  listStaffPorEmpresa,
  STAFF_ROL_LABELS,
  updateStaffHabilitado,
  type StaffMiembro,
} from "@/modules/staff-empresa";

type Props = {
  empresaId: string;
};

export function StaffListadoClient({ empresaId }: Props) {
  const [tick, setTick] = useState(0);

  const rows = useMemo(
    () => listStaffPorEmpresa(empresaId),
    [empresaId, tick],
  );

  function bump() {
    setTick((t) => t + 1);
  }

  function toggleHabilitado(row: StaffMiembro) {
    updateStaffHabilitado(empresaId, row.id, !row.habilitado);
    bump();
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[960px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700">
            <th className="px-4 py-3 font-semibold">Nombre</th>
            <th className="px-4 py-3 font-semibold">Documento</th>
            <th className="px-4 py-3 font-semibold">Correo</th>
            <th className="px-4 py-3 font-semibold">Tel.</th>
            <th className="px-4 py-3 font-semibold">Rol</th>
            <th className="px-4 py-3 font-semibold">Área y actividad</th>
            <th className="px-4 py-3 font-semibold">Confirmación ANP</th>
            <th className="px-4 py-3 font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                No hay personal registrado todavía.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-zinc-100 align-top transition-colors hover:bg-indigo-50/30">
                <td className="px-4 py-3 font-semibold text-zinc-900">
                  {row.nombreCompleto}
                </td>
                <td className="px-4 py-3 tabular-nums text-zinc-800">
                  {row.documento}
                </td>
                <td className="px-4 py-3 text-zinc-700">{row.email}</td>
                <td className="px-4 py-3 text-zinc-700">{row.telefono}</td>
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {STAFF_ROL_LABELS[row.rol]}
                </td>
                <td className="px-4 py-3 text-zinc-800">
                  <span className="block font-medium">{nombreAreaPorId(row.areaNaturalId)}</span>
                  <span className="text-xs text-zinc-500">
                    {nombreActividadPorId(row.actividadId)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {row.confirmadoPorAdmin ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      Confirmado por ANP
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleHabilitado(row)}
                    className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${row.habilitado
                      ? "border border-red-200 bg-white text-red-800 hover:bg-red-50"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                      }`}
                  >
                    {row.habilitado ? "Deshabilitar" : "Habilitar"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
