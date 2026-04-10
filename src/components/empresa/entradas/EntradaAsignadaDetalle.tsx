"use client";

import type { AsignacionEntrada } from "@/modules/asignaciones-entradas";
import type { PreviousConditions } from "@/types/visitante-salud";

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function SaludBloque({ s }: { s: PreviousConditions }) {
  const lineas: { label: string; detalle?: string }[] = [];

  if (s.hypertension) {
    lineas.push({
      label: "Hipertensión",
      detalle: [
        s.hypertensionBpSystolic != null && s.hypertensionBpDiastolic != null
          ? `PA ${s.hypertensionBpSystolic}/${s.hypertensionBpDiastolic}`
          : "",
        s.hypertensionMedication
          ? `Medicación: ${s.hypertensionMedication}`
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }
  if (s.allergy) {
    lineas.push({ label: "Alergia", detalle: s.allergyType });
  }
  if (s.diabetes) {
    lineas.push({ label: "Diabetes", detalle: s.diabetesType });
  }
  if (s.respiratoryProblems) {
    lineas.push({
      label: "Problemas respiratorios",
      detalle: s.respiratoryProblemType,
    });
  }
  if (s.heartCondition) {
    lineas.push({
      label: "Condición cardíaca",
      detalle: [s.heartConditionType, s.heartConditionAntecedentDetail]
        .filter(Boolean)
        .join(" — "),
    });
  }
  if (s.seizures) lineas.push({ label: "Convulsiones" });
  if (s.pregnancy) lineas.push({ label: "Embarazo" });
  if (s.currentlyTakingMedications) {
    lineas.push({
      label: "Medicación actual",
      detalle: s.medicationsDetail,
    });
  }
  if (s.acuteMountainSickness) {
    lineas.push({
      label: "MAM",
      detalle: [
        s.amsDate ? `Fecha: ${formatFecha(s.amsDate)}` : "",
        s.amsMedicallyTreated != null
          ? `Tratado médicamente: ${s.amsMedicallyTreated ? "Sí" : "No"}`
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }
  if (s.pulmonaryEdemaAltitude) {
    lineas.push({
      label: "Edema pulmonar altitud",
      detalle: [
        s.pulmonaryEdemaDate
          ? `Fecha: ${formatFecha(s.pulmonaryEdemaDate)}`
          : "",
        s.pulmonaryEdemaMedicallyTreated != null
          ? `Tratado: ${s.pulmonaryEdemaMedicallyTreated ? "Sí" : "No"}`
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }
  if (s.cerebralEdemaAltitude) {
    lineas.push({
      label: "Edema cerebral altitud",
      detalle: [
        s.cerebralEdemaDate
          ? `Fecha: ${formatFecha(s.cerebralEdemaDate)}`
          : "",
        s.cerebralEdemaMedicallyTreated != null
          ? `Tratado: ${s.cerebralEdemaMedicallyTreated ? "Sí" : "No"}`
          : "",
      ]
        .filter(Boolean)
        .join(" · "),
    });
  }

  if (lineas.length === 0) {
    return (
      <p className="text-sm text-zinc-600">
        Sin antecedentes marcados en el formulario.
      </p>
    );
  }

  return (
    <ul className="list-inside list-disc space-y-1 text-sm text-zinc-800">
      {lineas.map((l) => (
        <li key={l.label}>
          <span className="font-medium">{l.label}</span>
          {l.detalle ? (
            <span className="text-zinc-600"> — {l.detalle}</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

type Props = {
  row: AsignacionEntrada;
};

export function EntradaAsignadaDetalle({ row }: Props) {
  const p = row.persona;
  const seg = p.seguro;

  return (
    <details className="mt-2 rounded border border-zinc-100 bg-zinc-50/50 p-3 text-sm">
      <summary className="cursor-pointer font-medium text-zinc-800">
        Ver seguro y salud completos
      </summary>
      <div className="mt-3 space-y-4 border-t border-zinc-200 pt-3">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">
            Seguro
          </p>
          <dl className="mt-1 grid gap-1 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-zinc-500">Aseguradora</dt>
              <dd>{seg.aseguradora}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Póliza</dt>
              <dd className="tabular-nums">{seg.numeroPoliza}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Vigencia desde</dt>
              <dd>{formatFecha(seg.vigenciaDesde)}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Vigencia hasta</dt>
              <dd>{formatFecha(seg.vigenciaHasta)}</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">
            Salud (antecedentes)
          </p>
          <div className="mt-1">
            <SaludBloque s={p.salud} />
          </div>
        </div>
      </div>
    </details>
  );
}
