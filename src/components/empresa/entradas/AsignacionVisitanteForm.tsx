"use client";

import { useState } from "react";
import type { CompraEntradaEmpresa } from "@/modules/compras-empresa";
import { crearAsignacion } from "@/modules/asignaciones-entradas";
import { emptyPreviousConditions } from "@/types/visitante-salud";
import { SaludPreviousConditionsFields } from "./SaludPreviousConditionsFields";

type Props = {
  empresaId: string;
  compra: CompraEntradaEmpresa;
  onAssigned: () => void;
  onCancel: () => void;
};

const field =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30";

export function AsignacionVisitanteForm({
  empresaId,
  compra,
  onAssigned,
  onCancel,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [aseguradora, setAseguradora] = useState("");
  const [numeroPoliza, setNumeroPoliza] = useState("");
  const [vigenciaDesde, setVigenciaDesde] = useState("");
  const [vigenciaHasta, setVigenciaHasta] = useState("");
  const [salud, setSalud] = useState(emptyPreviousConditions);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const n = nombre.trim();
    const a = apellido.trim();
    const d = documento.trim();
    const em = email.trim().toLowerCase();
    const tel = telefono.trim();
    const as = aseguradora.trim();
    const pol = numeroPoliza.trim();

    if (!n || !a || !d || !em || !tel) {
      setError("Completá nombre, apellido, documento, correo y teléfono.");
      return;
    }
    if (!as || !pol || !vigenciaDesde || !vigenciaHasta) {
      setError("Completá todos los datos del seguro y las fechas de vigencia.");
      return;
    }
    if (vigenciaHasta < vigenciaDesde) {
      setError("La vigencia hasta debe ser posterior o igual al inicio.");
      return;
    }

    try {
      crearAsignacion({
        empresaId,
        compraId: compra.id,
        actividadId: compra.actividadId,
        areaNaturalId: compra.areaNaturalId,
        persona: {
          nombre: n,
          apellido: a,
          documento: d,
          email: em,
          telefono: tel,
          seguro: {
            aseguradora: as,
            numeroPoliza: pol,
            vigenciaDesde,
            vigenciaHasta,
          },
          salud,
        },
      });
      onAssigned();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-4"
    >
      <p className="text-sm font-medium text-zinc-900">
        Asignar una entrada de esta compra
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Los datos se guardan solo en este navegador (prototipo).
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="as-nom">
            Nombre
          </label>
          <input
            id="as-nom"
            required
            className={field}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="as-ape">
            Apellido
          </label>
          <input
            id="as-ape"
            required
            className={field}
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800" htmlFor="as-doc">
            DNI o pasaporte
          </label>
          <input
            id="as-doc"
            required
            className={field}
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="as-mail">
            Correo
          </label>
          <input
            id="as-mail"
            type="email"
            required
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="as-tel">
            Teléfono
          </label>
          <input
            id="as-tel"
            type="tel"
            required
            className={field}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
      </div>

      <fieldset className="mt-6 rounded-md border border-zinc-200 bg-white p-4">
        <legend className="px-1 text-sm font-semibold text-zinc-900">
          Seguro
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-800" htmlFor="as-aseg">
              Aseguradora
            </label>
            <input
              id="as-aseg"
              required
              className={field}
              value={aseguradora}
              onChange={(e) => setAseguradora(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-zinc-800" htmlFor="as-pol">
              Número de póliza
            </label>
            <input
              id="as-pol"
              required
              className={field}
              value={numeroPoliza}
              onChange={(e) => setNumeroPoliza(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-800" htmlFor="as-v1">
              Vigencia desde
            </label>
            <input
              id="as-v1"
              type="date"
              required
              className={field}
              value={vigenciaDesde}
              onChange={(e) => setVigenciaDesde(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-800" htmlFor="as-v2">
              Vigencia hasta
            </label>
            <input
              id="as-v2"
              type="date"
              required
              className={field}
              value={vigenciaHasta}
              onChange={(e) => setVigenciaHasta(e.target.value)}
            />
          </div>
        </div>
      </fieldset>

      <div className="mt-6">
        <p className="mb-2 text-sm font-semibold text-zinc-900">
          Datos de salud
        </p>
        <SaludPreviousConditionsFields value={salud} onChange={setSalud} />
      </div>

      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Confirmar asignación
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
