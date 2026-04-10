"use client";

import { useRouter } from "next/navigation";
import {
  nombreAreaPorId,
  type EmpresaHabilitada,
} from "@/modules/empresas-habilitadas";

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

type Props = {
  empresas: EmpresaHabilitada[];
  /** Resalta la fila (p. ej. última empresa en vista usuarios). */
  activeEmpresaId?: string | null;
};

export function EmpresaListTable({ empresas, activeEmpresaId }: Props) {
  const router = useRouter();

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700">
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">CUIT</th>
              <th className="px-4 py-3 font-semibold">Correo</th>
              <th className="px-4 py-3 font-semibold">Autorización</th>
              <th className="px-4 py-3 font-semibold">ANP</th>
            </tr>
          </thead>
          <tbody>
            {empresas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  No hay empresas cargadas todavía.
                </td>
              </tr>
            ) : (
              empresas.map((row) => {
                const active = activeEmpresaId === row.id;
                return (
                  <tr
                    key={row.id}
                    role="link"
                    tabIndex={0}
                    className={`cursor-pointer border-b border-zinc-100 transition-colors ${active ? "bg-indigo-50" : "hover:bg-indigo-50/50"}`}
                    onClick={() =>
                      router.push(`/admin/empresas/${row.id}`)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/admin/empresas/${row.id}`);
                      }
                    }}
                  >
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {row.nombre}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-800">
                      {row.cuit}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{row.email}</td>
                    <td className="px-4 py-3 text-zinc-700">
                      {formatDate(row.autorizacionDesde)} —{" "}
                      {formatDate(row.autorizacionHasta)}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">
                      {row.areasNaturalesIds
                        .map((id) => nombreAreaPorId(id))
                        .join(", ")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-zinc-500">
        Tocá una fila para ver staff y usuarios de esa empresa.
      </p>
    </div>
  );
}
