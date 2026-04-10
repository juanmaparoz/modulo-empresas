"use client";

import { useState } from "react";
import {
  AREAS_NATURALES_PROTOTIPO,
  createEmpresa,
} from "@/modules/empresas-habilitadas";

const emptyEmpresaForm = {
  nombre: "",
  cuit: "",
  email: "",
  autorizacionDesde: "",
  autorizacionHasta: "",
};

type Props = {
  onCreated: () => void;
};

export function EmpresaCreateForm({ onCreated }: Props) {
  const [empresaForm, setEmpresaForm] = useState(emptyEmpresaForm);
  const [areasSel, setAreasSel] = useState<Record<string, boolean>>({});
  const [empresaError, setEmpresaError] = useState<string | null>(null);

  function toggleArea(id: string) {
    setAreasSel((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmpresaError(null);

    const areasNaturalesIds = Object.entries(areasSel)
      .filter(([, on]) => on)
      .map(([id]) => id);

    if (areasNaturalesIds.length === 0) {
      setEmpresaError("Seleccioná al menos un área natural protegida.");
      return;
    }

    if (!empresaForm.autorizacionDesde || !empresaForm.autorizacionHasta) {
      setEmpresaError("Completá las fechas de autorización.");
      return;
    }

    if (empresaForm.autorizacionHasta < empresaForm.autorizacionDesde) {
      setEmpresaError(
        "La fecha de fin de autorización debe ser igual o posterior al inicio.",
      );
      return;
    }

    const cuit = empresaForm.cuit.replace(/\D/g, "");
    if (cuit.length !== 11) {
      setEmpresaError("El CUIT debe tener 11 dígitos.");
      return;
    }

    createEmpresa({
      nombre: empresaForm.nombre.trim(),
      cuit,
      email: empresaForm.email.trim().toLowerCase(),
      autorizacionDesde: empresaForm.autorizacionDesde,
      autorizacionHasta: empresaForm.autorizacionHasta,
      areasNaturalesIds,
    });

    setEmpresaForm(emptyEmpresaForm);
    setAreasSel({});
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid w-full max-w-4xl gap-4 rounded-lg border border-zinc-300 bg-white p-6 shadow-lg sm:grid-cols-2 lg:p-8"
    >
      <div className="sm:col-span-2">
        <label className="text-sm font-medium text-zinc-800" htmlFor="enombre">
          Nombre de la empresa
        </label>
        <input
          id="enombre"
          required
          value={empresaForm.nombre}
          onChange={(ev) =>
            setEmpresaForm((f) => ({ ...f, nombre: ev.target.value }))
          }
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="ecuit">
          CUIT
        </label>
        <input
          id="ecuit"
          required
          inputMode="numeric"
          autoComplete="off"
          placeholder="11 dígitos"
          value={empresaForm.cuit}
          onChange={(ev) =>
            setEmpresaForm((f) => ({ ...f, cuit: ev.target.value }))
          }
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="eemail">
          Correo de contacto
        </label>
        <input
          id="eemail"
          type="email"
          required
          value={empresaForm.email}
          onChange={(ev) =>
            setEmpresaForm((f) => ({ ...f, email: ev.target.value }))
          }
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="edesde">
          Inicio autorización
        </label>
        <input
          id="edesde"
          type="date"
          required
          value={empresaForm.autorizacionDesde}
          onChange={(ev) =>
            setEmpresaForm((f) => ({
              ...f,
              autorizacionDesde: ev.target.value,
            }))
          }
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="ehasta">
          Fin autorización
        </label>
        <input
          id="ehasta"
          type="date"
          required
          value={empresaForm.autorizacionHasta}
          onChange={(ev) =>
            setEmpresaForm((f) => ({
              ...f,
              autorizacionHasta: ev.target.value,
            }))
          }
          className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
        />
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-medium text-zinc-800">
          Áreas naturales protegidas habilitadas
        </legend>
        <ul className="mt-2 flex flex-col gap-2">
          {AREAS_NATURALES_PROTOTIPO.map((a) => (
            <li key={a.id}>
              <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-800">
                <input
                  type="checkbox"
                  checked={!!areasSel[a.id]}
                  onChange={() => toggleArea(a.id)}
                  className="mt-0.5 rounded border-zinc-300"
                />
                <span>{a.nombre}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {empresaError ? (
        <p className="sm:col-span-2 text-sm text-red-700" role="alert">
          {empresaError}
        </p>
      ) : null}

      <div className="flex justify-end sm:col-span-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Registrar empresa
        </button>
      </div>
    </form>
  );
}
