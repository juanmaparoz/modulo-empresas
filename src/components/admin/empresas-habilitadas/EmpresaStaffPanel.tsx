"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { nombreActividadPorId } from "@/modules/actividades";
import { getEmpresa, nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  listStaffPorEmpresa,
  STAFF_ROL_LABELS,
  updateStaffConfirmacionPorAdmin,
  type StaffMiembro,
} from "@/modules/staff-empresa";

type Props = {
  empresaId: string;
};

export function EmpresaStaffPanel({ empresaId }: Props) {
  const empresa = useMemo(() => getEmpresa(empresaId), [empresaId]);
  const [tick, setTick] = useState(0);

  const rows = useMemo(
    () => listStaffPorEmpresa(empresaId),
    [empresaId, tick],
  );

  function bump() {
    setTick((t) => t + 1);
  }

  function confirmar(row: StaffMiembro) {
    updateStaffConfirmacionPorAdmin(empresaId, row.id, true);
    bump();
  }

  if (!empresa) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">
        Staff de {empresa.nombre}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        Personal cargado por la empresa. Confirmá el alta para que figure como
        validado.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-600">
              <th className="py-2 pr-3 font-medium">Nombre</th>
              <th className="py-2 pr-3 font-medium">Documento</th>
              <th className="py-2 pr-3 font-medium">Rol</th>
              <th className="py-2 pr-3 font-medium">Área / Actividad</th>
              <th className="py-2 pr-3 font-medium">Estado ANP</th>
              <th className="py-2 pr-3 font-medium">En empresa</th>
              <th className="py-2 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-zinc-500">
                  Esta empresa no tiene staff cargado.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-zinc-100 align-top">
                  <td className="py-2 pr-3 font-medium text-zinc-900">
                    {row.nombreCompleto}
                  </td>
                  <td className="py-2 pr-3 tabular-nums text-zinc-800">
                    {row.documento}
                  </td>
                  <td className="py-2 pr-3 text-zinc-800">
                    {STAFF_ROL_LABELS[row.rol]}
                  </td>
                  <td className="py-2 pr-3 text-zinc-800">
                    <span className="block">
                      {nombreAreaPorId(row.areaNaturalId)}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {nombreActividadPorId(row.actividadId)}
                    </span>
                  </td>
                  <td className="py-2 pr-3">
                    {row.confirmadoPorAdmin ? (
                      <span className="inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">
                        Confirmado
                      </span>
                    ) : (
                      <span className="inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-950">
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3">
                    {row.habilitado ? (
                      <span className="text-xs font-medium text-emerald-800">
                        Habilitado
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-zinc-500">
                        Deshabilitado
                      </span>
                    )}
                  </td>
                  <td className="py-2">
                    {!row.confirmadoPorAdmin ? (
                      <button
                        type="button"
                        onClick={() => confirmar(row)}
                        className="rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
                      >
                        Confirmar
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
