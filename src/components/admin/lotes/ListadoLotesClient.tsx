"use client";

import { useCallback, useEffect, useState } from "react";
import { nombreActividadPorId } from "@/modules/actividades";
import { nombreAreaPorId } from "@/modules/empresas-habilitadas";
import { listLotes, type LoteEntradas } from "@/modules/lotes-anp";

function formatDescuento(p: number): string {
  if (p <= 0) return "Sin descuento";
  return `${p} %`;
}

export function ListadoLotesClient() {
  const [rows, setRows] = useState<LoteEntradas[]>([]);

  const refresh = useCallback(() => {
    setRows(listLotes());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[600px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700">
            <th className="px-4 py-3 font-semibold">Área natural</th>
            <th className="px-4 py-3 font-semibold">Actividad</th>
            <th className="px-4 py-3 font-semibold">Entradas</th>
            <th className="px-4 py-3 font-semibold">Descuento</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                No hay lotes cargados todavía.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-zinc-100 transition-colors hover:bg-indigo-50/30">
                <td className="px-4 py-3 font-semibold text-zinc-900">
                  {nombreAreaPorId(row.areaNaturalId)}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-800">
                  {nombreActividadPorId(row.actividadId)}
                </td>
                <td className="px-4 py-3 tabular-nums font-semibold text-indigo-700">
                  {row.cantidadEntradas.toLocaleString("es-AR")}
                </td>
                <td className="px-4 py-3">
                  {row.descuentoPorcentaje > 0 ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      {row.descuentoPorcentaje} %
                    </span>
                  ) : (
                    <span className="text-zinc-500">Sin descuento</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
