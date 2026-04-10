"use client";

import { useMemo, useState } from "react";
import {
  getNombreCompletoAdmin,
  listAdmins,
  updateAdminHabilitado,
  type AdminUser,
} from "@/modules/admins";

export function ListadoAdminsClient() {
  const [tick, setTick] = useState(0);

  const admins = useMemo(() => listAdmins(), [tick]);

  function bump() {
    setTick((t) => t + 1);
  }

  function toggleHabilitado(admin: AdminUser) {
    updateAdminHabilitado(admin.id, !admin.habilitado);
    bump();
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Administradores ANP
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Usuarios que gestionan empresas, lotes y staff.
      </p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700">
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Documento</th>
              <th className="px-4 py-3 font-semibold">Teléfono</th>
              <th className="px-4 py-3 font-semibold">Correo</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                  No hay administradores creados. Usá "Crear admin" para agregar
                  uno.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-zinc-100 align-middle transition-colors hover:bg-indigo-50/30"
                >
                  <td className="px-4 py-3 font-semibold text-zinc-900">
                    {getNombreCompletoAdmin(admin)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">
                    {admin.documento || <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {admin.telefono || <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{admin.email}</td>
                  <td className="px-4 py-3">
                    {admin.habilitado ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        Habilitado
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        Deshabilitado
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleHabilitado(admin)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                        admin.habilitado
                          ? "border border-red-200 bg-white text-red-800 hover:bg-red-50"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                      }`}
                    >
                      {admin.habilitado ? "Deshabilitar" : "Habilitar"}
                    </button>
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
