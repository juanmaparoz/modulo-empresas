"use client";

import { useMemo, useState } from "react";
import { listActividadesEnAreas, nombreActividadPorId } from "@/modules/actividades";
import { getEmpresa, nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  listStaffPorEmpresa,
  STAFF_ROL_LABELS,
  updateStaffHabilitado,
  type StaffMiembro,
  type StaffRolCumplimiento,
} from "@/modules/staff-empresa";

type Props = {
  empresaId: string;
};

function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export function StaffListadoClient({ empresaId }: Props) {
  const empresa = useMemo(() => getEmpresa(empresaId), [empresaId]);
  const areas = empresa?.areasNaturalesIds ?? [];
  const actividades = useMemo(() => listActividadesEnAreas(areas), [areas]);

  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [filterRol, setFilterRol] = useState<string>("");
  const [filterArea, setFilterArea] = useState<string>("");
  const [filterActividad, setFilterActividad] = useState<string>("");
  const [filterEstado, setFilterEstado] = useState<string>("");

  const allRows = useMemo(
    () => listStaffPorEmpresa(empresaId),
    [empresaId, tick],
  );

  const filteredRows = useMemo(() => {
    let result = allRows;

    // Búsqueda por texto
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.nombreCompleto.toLowerCase().includes(q) ||
          r.documento.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
      );
    }

    // Filtro por rol
    if (filterRol) {
      result = result.filter((r) => r.rol === filterRol);
    }

    // Filtro por área
    if (filterArea) {
      result = result.filter((r) => r.areaNaturalId === filterArea);
    }

    // Filtro por actividad
    if (filterActividad) {
      result = result.filter((r) => r.actividadId === filterActividad);
    }

    // Filtro por estado
    if (filterEstado === "habilitado") {
      result = result.filter((r) => r.habilitado);
    } else if (filterEstado === "deshabilitado") {
      result = result.filter((r) => !r.habilitado);
    } else if (filterEstado === "confirmado") {
      result = result.filter((r) => r.confirmadoPorAdmin);
    } else if (filterEstado === "pendiente") {
      result = result.filter((r) => !r.confirmadoPorAdmin);
    }

    return result;
  }, [allRows, search, filterRol, filterArea, filterActividad, filterEstado]);

  function bump() {
    setTick((t) => t + 1);
  }

  function toggleHabilitado(row: StaffMiembro) {
    updateStaffHabilitado(empresaId, row.id, !row.habilitado);
    bump();
  }

  function clearFilters() {
    setSearch("");
    setFilterRol("");
    setFilterArea("");
    setFilterActividad("");
    setFilterEstado("");
  }

  const hasActiveFilters =
    search || filterRol || filterArea || filterActividad || filterEstado;

  const roles: StaffRolCumplimiento[] = ["guia_montana", "arriero"];

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      {/* Buscador y filtros */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Buscador */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre, documento o correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterRol}
              onChange={(e) => setFilterRol(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            >
              <option value="">Todos los roles</option>
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {STAFF_ROL_LABELS[rol]}
                </option>
              ))}
            </select>

            <select
              value={filterArea}
              onChange={(e) => {
                setFilterArea(e.target.value);
                setFilterActividad("");
              }}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            >
              <option value="">Todas las áreas</option>
              {areas.map((areaId) => (
                <option key={areaId} value={areaId}>
                  {nombreAreaPorId(areaId)}
                </option>
              ))}
            </select>

            <select
              value={filterActividad}
              onChange={(e) => setFilterActividad(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            >
              <option value="">Todas las actividades</option>
              {actividades
                .filter((a) => !filterArea || a.areaNaturalId === filterArea)
                .map((act) => (
                  <option key={act.id} value={act.id}>
                    {act.nombre}
                  </option>
                ))}
            </select>

            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            >
              <option value="">Todos los estados</option>
              <option value="habilitado">Habilitados</option>
              <option value="deshabilitado">Deshabilitados</option>
              <option value="confirmado">Confirmados ANP</option>
              <option value="pendiente">Pendientes ANP</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-md px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Contador */}
          <p className="text-xs text-zinc-500">
            Mostrando {filteredRows.length} de {allRows.length} registros
          </p>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 font-semibold text-zinc-700">Nombre</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Documento</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Correo</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Teléfono</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Rol</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Área / Actividad</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Estado</th>
              <th className="px-4 py-3 font-semibold text-zinc-700">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                  {hasActiveFilters
                    ? "No se encontraron resultados con los filtros aplicados."
                    : "No hay personal registrado todavía."}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-zinc-100 transition-colors hover:bg-indigo-50/30 ${
                    !row.habilitado ? "bg-zinc-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-semibold text-zinc-900">
                      {row.nombreCompleto}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-zinc-700">
                    {row.documento}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">{row.email}</td>
                  <td className="px-4 py-3 text-zinc-700">
                    {row.telefono || "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-700">
                    {STAFF_ROL_LABELS[row.rol]}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-xs font-semibold text-zinc-800">
                      {nombreAreaPorId(row.areaNaturalId)}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {nombreActividadPorId(row.actividadId)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`inline-block h-2 w-2 shrink-0 rounded-full ${
                          row.confirmadoPorAdmin ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <span className="text-xs text-zinc-600">
                        {row.confirmadoPorAdmin ? "Confirmado" : "Pendiente"}
                      </span>
                    </span>
                    {!row.habilitado && (
                      <span className="ml-1 text-xs text-red-600">· Deshabilitado</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleHabilitado(row)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                        row.habilitado
                          ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
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
    </div>
  );
}
