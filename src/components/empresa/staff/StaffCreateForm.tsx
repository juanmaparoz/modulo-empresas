"use client";

import { useEffect, useMemo, useState } from "react";
import { listActividadesPorArea } from "@/modules/actividades";
import { getEmpresa, nombreAreaPorId } from "@/modules/empresas-habilitadas";
import {
  createStaff,
  STAFF_ROL_LABELS,
  type StaffRolCumplimiento,
} from "@/modules/staff-empresa";

type Props = {
  empresaId: string;
  onCreated: () => void;
};

const roles: StaffRolCumplimiento[] = ["guia_montana", "arriero"];

export function StaffCreateForm({ empresaId, onCreated }: Props) {
  const empresa = useMemo(() => getEmpresa(empresaId), [empresaId]);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState<StaffRolCumplimiento>("guia_montana");
  const [areaNaturalId, setAreaNaturalId] = useState("");
  const [actividadId, setActividadId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const anpsEmpresa = empresa?.areasNaturalesIds ?? [];

  const actividadesEnArea = useMemo(
    () => (areaNaturalId ? listActividadesPorArea(areaNaturalId) : []),
    [areaNaturalId],
  );

  useEffect(() => {
    if (!areaNaturalId) return;
    const first = actividadesEnArea[0];
    setActividadId((prev) => {
      if (prev && actividadesEnArea.some((a) => a.id === prev)) return prev;
      return first?.id ?? "";
    });
  }, [areaNaturalId, actividadesEnArea]);

  useEffect(() => {
    if (anpsEmpresa.length === 0) {
      setAreaNaturalId("");
      return;
    }
    setAreaNaturalId((prev) =>
      prev && anpsEmpresa.includes(prev) ? prev : anpsEmpresa[0],
    );
  }, [anpsEmpresa]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!empresa) {
      setError("No se encontró la empresa en el sistema.");
      return;
    }

    const nombre = nombreCompleto.trim();
    const doc = documento.trim();
    const em = email.trim().toLowerCase();
    const tel = telefono.trim();

    if (!nombre || !doc || !em || !tel) {
      setError("Completá todos los datos de la persona.");
      return;
    }

    if (!areaNaturalId || !actividadId) {
      setError("Elegí área natural y actividad habilitada.");
      return;
    }

    if (!anpsEmpresa.includes(areaNaturalId)) {
      setError("El área elegida no está habilitada para tu empresa.");
      return;
    }

    const actOk = actividadesEnArea.some((a) => a.id === actividadId);
    if (!actOk) {
      setError("La actividad no corresponde al área seleccionada.");
      return;
    }

    createStaff({
      empresaId,
      nombreCompleto: nombre,
      documento: doc,
      email: em,
      telefono: tel,
      rol,
      habilitado: true,
      areaNaturalId,
      actividadId,
      confirmadoPorAdmin: false,
    });

    setNombreCompleto("");
    setDocumento("");
    setEmail("");
    setTelefono("");
    setRol("guia_montana");
    onCreated();
  }

  if (!empresa) {
    return (
      <p className="text-sm text-red-700">
        No se encontró la empresa. Volvé a iniciar sesión.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-4xl gap-4 rounded-lg border border-zinc-300 bg-white p-6 shadow-lg sm:grid-cols-2 lg:p-8"
      noValidate
    >
      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-zinc-800" htmlFor="snombre">
          Nombre completo
        </label>
        <input
          id="snombre"
          required
          value={nombreCompleto}
          onChange={(ev) => setNombreCompleto(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="sdoc">
          DNI o pasaporte
        </label>
        <input
          id="sdoc"
          required
          value={documento}
          onChange={(ev) => setDocumento(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="srol">
          Rol
        </label>
        <select
          id="srol"
          value={rol}
          onChange={(ev) =>
            setRol(ev.target.value as StaffRolCumplimiento)
          }
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {STAFF_ROL_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="semail">
          Correo
        </label>
        <input
          id="semail"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="stel">
          Teléfono
        </label>
        <input
          id="stel"
          type="tel"
          required
          autoComplete="tel"
          value={telefono}
          onChange={(ev) => setTelefono(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>

      <div className="sm:col-span-2">
        <label
          className="text-sm font-medium text-zinc-800"
          htmlFor="sarea"
        >
          Área natural habilitada
        </label>
        <p className="mt-0.5 text-xs text-zinc-500">
          Se define en el alta y no se puede cambiar después.
        </p>
        <select
          id="sarea"
          value={areaNaturalId}
          onChange={(ev) => setAreaNaturalId(ev.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        >
          {anpsEmpresa.map((id) => (
            <option key={id} value={id}>
              {nombreAreaPorId(id)}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-zinc-800" htmlFor="sact">
          Actividad habilitada
        </label>
        <select
          id="sact"
          value={actividadId}
          onChange={(ev) => setActividadId(ev.target.value)}
          disabled={actividadesEnArea.length === 0}
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30 disabled:opacity-60"
        >
          {actividadesEnArea.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
        {actividadesEnArea.length === 0 ? (
          <p className="mt-1 text-xs text-amber-800">
            No hay actividades de catálogo para esta área. Contactá al
            administrador ANP.
          </p>
        ) : (
          <p className="mt-1 text-xs text-zinc-500">
            Queda fija al guardar; no se puede editar después.
          </p>
        )}
      </div>

      {error ? (
        <p className="sm:col-span-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end sm:col-span-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Registrar personal
        </button>
      </div>
    </form>
  );
}
