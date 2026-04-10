"use client";

import type { PreviousConditions } from "@/types/visitante-salud";

type Props = {
  value: PreviousConditions;
  onChange: (next: PreviousConditions) => void;
};

const input =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30";
const label = "text-sm font-medium text-zinc-800";
const sub = "text-xs text-zinc-500";

export function SaludPreviousConditionsFields({ value, onChange }: Props) {
  function patch<K extends keyof PreviousConditions>(
    key: K,
    v: PreviousConditions[K],
  ) {
    onChange({ ...value, [key]: v });
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="rounded-md border border-zinc-200 p-4">
        <legend className="px-1 text-sm font-semibold text-zinc-900">
          Condiciones generales
        </legend>
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.hypertension}
              onChange={(e) => patch("hypertension", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Hipertensión</span>
          </label>
          {value.hypertension ? (
            <div className="ml-6 grid max-w-md gap-2 sm:grid-cols-3">
              <div>
                <span className={sub}>PA sistólica</span>
                <input
                  type="number"
                  className={input}
                  value={value.hypertensionBpSystolic ?? ""}
                  onChange={(e) =>
                    patch(
                      "hypertensionBpSystolic",
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </div>
              <div>
                <span className={sub}>PA diastólica</span>
                <input
                  type="number"
                  className={input}
                  value={value.hypertensionBpDiastolic ?? ""}
                  onChange={(e) =>
                    patch(
                      "hypertensionBpDiastolic",
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                    )
                  }
                />
              </div>
              <div className="sm:col-span-3">
                <span className={sub}>Medicación</span>
                <input
                  type="text"
                  className={input}
                  value={value.hypertensionMedication ?? ""}
                  onChange={(e) =>
                    patch("hypertensionMedication", e.target.value || undefined)
                  }
                />
              </div>
            </div>
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.allergy}
              onChange={(e) => patch("allergy", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Alergia</span>
          </label>
          {value.allergy ? (
            <input
              type="text"
              placeholder="Tipo / detalle"
              className={`${input} ml-6 max-w-md`}
              value={value.allergyType ?? ""}
              onChange={(e) => patch("allergyType", e.target.value || undefined)}
            />
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.diabetes}
              onChange={(e) => patch("diabetes", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Diabetes</span>
          </label>
          {value.diabetes ? (
            <input
              type="text"
              placeholder="Tipo"
              className={`${input} ml-6 max-w-md`}
              value={value.diabetesType ?? ""}
              onChange={(e) => patch("diabetesType", e.target.value || undefined)}
            />
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.respiratoryProblems}
              onChange={(e) => patch("respiratoryProblems", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Problemas respiratorios</span>
          </label>
          {value.respiratoryProblems ? (
            <input
              type="text"
              placeholder="Tipo"
              className={`${input} ml-6 max-w-md`}
              value={value.respiratoryProblemType ?? ""}
              onChange={(e) =>
                patch("respiratoryProblemType", e.target.value || undefined)
              }
            />
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.heartCondition}
              onChange={(e) => patch("heartCondition", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Condición cardíaca</span>
          </label>
          {value.heartCondition ? (
            <div className="ml-6 flex max-w-xl flex-col gap-2">
              <input
                type="text"
                placeholder="Tipo"
                className={input}
                value={value.heartConditionType ?? ""}
                onChange={(e) =>
                  patch("heartConditionType", e.target.value || undefined)
                }
              />
              <textarea
                placeholder="Antecedentes / detalle"
                rows={2}
                className={input}
                value={value.heartConditionAntecedentDetail ?? ""}
                onChange={(e) =>
                  patch(
                    "heartConditionAntecedentDetail",
                    e.target.value || undefined,
                  )
                }
              />
            </div>
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.seizures}
              onChange={(e) => patch("seizures", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Convulsiones</span>
          </label>
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.pregnancy}
              onChange={(e) => patch("pregnancy", e.target.checked)}
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Embarazo</span>
          </label>

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.currentlyTakingMedications}
              onChange={(e) =>
                patch("currentlyTakingMedications", e.target.checked)
              }
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Toma medicación actualmente</span>
          </label>
          {value.currentlyTakingMedications ? (
            <textarea
              placeholder="Detalle de medicación"
              rows={2}
              className={`${input} ml-6 max-w-xl`}
              value={value.medicationsDetail ?? ""}
              onChange={(e) =>
                patch("medicationsDetail", e.target.value || undefined)
              }
            />
          ) : null}
        </div>
      </fieldset>

      <fieldset className="rounded-md border border-zinc-200 p-4">
        <legend className="px-1 text-sm font-semibold text-zinc-900">
          Mal de montaña y edemas (altitud)
        </legend>
        <div className="mt-3 space-y-3">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.acuteMountainSickness}
              onChange={(e) =>
                patch("acuteMountainSickness", e.target.checked)
              }
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Mal agudo de montaña (MAM)</span>
          </label>
          {value.acuteMountainSickness ? (
            <div className="ml-6 flex max-w-md flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <span className={sub}>Fecha</span>
                <input
                  type="date"
                  className={input}
                  value={value.amsDate ?? ""}
                  onChange={(e) => patch("amsDate", e.target.value || undefined)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!value.amsMedicallyTreated}
                  onChange={(e) => patch("amsMedicallyTreated", e.target.checked)}
                />
                Tratado médicamente
              </label>
            </div>
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.pulmonaryEdemaAltitude}
              onChange={(e) =>
                patch("pulmonaryEdemaAltitude", e.target.checked)
              }
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Edema pulmonar de altitud</span>
          </label>
          {value.pulmonaryEdemaAltitude ? (
            <div className="ml-6 flex max-w-md flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <span className={sub}>Fecha</span>
                <input
                  type="date"
                  className={input}
                  value={value.pulmonaryEdemaDate ?? ""}
                  onChange={(e) =>
                    patch("pulmonaryEdemaDate", e.target.value || undefined)
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!value.pulmonaryEdemaMedicallyTreated}
                  onChange={(e) =>
                    patch(
                      "pulmonaryEdemaMedicallyTreated",
                      e.target.checked,
                    )
                  }
                />
                Tratado médicamente
              </label>
            </div>
          ) : null}

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={value.cerebralEdemaAltitude}
              onChange={(e) =>
                patch("cerebralEdemaAltitude", e.target.checked)
              }
              className="mt-1 rounded border-zinc-300"
            />
            <span className={label}>Edema cerebral de altitud</span>
          </label>
          {value.cerebralEdemaAltitude ? (
            <div className="ml-6 flex max-w-md flex-col gap-2 sm:flex-row sm:items-end">
              <div className="flex-1">
                <span className={sub}>Fecha</span>
                <input
                  type="date"
                  className={input}
                  value={value.cerebralEdemaDate ?? ""}
                  onChange={(e) =>
                    patch("cerebralEdemaDate", e.target.value || undefined)
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!value.cerebralEdemaMedicallyTreated}
                  onChange={(e) =>
                    patch(
                      "cerebralEdemaMedicallyTreated",
                      e.target.checked,
                    )
                  }
                />
                Tratado médicamente
              </label>
            </div>
          ) : null}
        </div>
      </fieldset>
    </div>
  );
}
