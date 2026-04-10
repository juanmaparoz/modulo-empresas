"use client";

import { useState } from "react";

function HelpIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
        <h3 className="font-semibold text-zinc-900">{title}</h3>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function RoleCard({
  title,
  description,
  features,
  color,
}: {
  title: string;
  description: string;
  features: string[];
  color: "indigo" | "emerald" | "amber";
}) {
  const colors = {
    indigo: "border-l-indigo-500 bg-indigo-50/30",
    emerald: "border-l-emerald-500 bg-emerald-50/30",
    amber: "border-l-amber-500 bg-amber-50/30",
  };

  return (
    <div className={`rounded-lg border border-zinc-200 border-l-4 p-4 ${colors[color]}`}>
      <p className="font-semibold text-zinc-900">{title}</p>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      <ul className="mt-3 space-y-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-700">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ManualUsuarioModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-105 hover:shadow-xl"
        title="Manual de usuario"
      >
        <HelpIcon />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal content */}
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-zinc-100 shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">
                  Manual de Usuario
                </h2>
                <p className="text-sm text-zinc-500">Sistema de Gestión de Entradas ANP</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div
              className="overflow-y-auto px-6 py-6"
              style={{ maxHeight: "calc(90vh - 85px)" }}
            >
              <div className="space-y-4">
                {/* Aviso de prototipo */}
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="font-semibold text-amber-800">Versión Prototipo</p>
                      <p className="mt-1 text-sm text-amber-700">
                        Este sistema es un prototipo en desarrollo. No todas las
                        funcionalidades definidas están implementadas. Los datos se
                        almacenan localmente en el navegador y pueden perderse al
                        limpiar el caché.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <Section title="¿Qué es este sistema?">
                  <p className="text-sm text-zinc-700">
                    Sistema web para la gestión de entradas a <strong>Áreas Naturales
                    Protegidas</strong>, permitiendo a empresas prestadoras comprar entradas,
                    asignarlas a visitantes y gestionar su personal operativo.
                  </p>
                </Section>

                {/* Roles */}
                <Section title="Roles del Sistema">
                  <div className="space-y-3">
                    <RoleCard
                      title="Super Admin"
                      description="Administrador principal del sistema"
                      features={[
                        "Crear y gestionar administradores ANP",
                        "Habilitar/deshabilitar administradores",
                      ]}
                      color="indigo"
                    />
                    <RoleCard
                      title="Admin ANP"
                      description="Gestiona empresas y configuración"
                      features={[
                        "Registrar y gestionar empresas habilitadas",
                        "Crear lotes de entradas con descuentos",
                        "Confirmar staff de empresas",
                      ]}
                      color="emerald"
                    />
                    <RoleCard
                      title="Usuario de Empresa"
                      description="Operador de empresa prestadora"
                      features={[
                        "Comprar entradas (por lote o personalizada)",
                        "Asignar entradas a visitantes",
                        "Registrar y gestionar personal (staff)",
                        "Editar perfil y cambiar contraseña",
                      ]}
                      color="amber"
                    />
                  </div>
                </Section>

                {/* Módulos */}
                <Section title="Módulos Principales">
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-zinc-800">Compra de Entradas</p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                        <li>• <strong>Por lote:</strong> Cantidad fija con descuento automático</li>
                        <li>• <strong>Personalizada:</strong> Cantidad libre sin descuento</li>
                        <li>• Opción de definir fecha de visita con plazo para cargar datos</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-800">Asignación de Entradas</p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                        <li>• Asignar datos del visitante (nombre, DNI, contacto)</li>
                        <li>• Datos opcionales de salud</li>
                        <li>• Las entradas vencidas no pueden asignarse</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-800">Gestión de Staff</p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                        <li>• Registrar personal con rol y área asignada</li>
                        <li>• Requiere confirmación del Admin ANP</li>
                        <li>• Búsqueda y filtros avanzados</li>
                      </ul>
                    </div>
                  </div>
                </Section>

                {/* Áreas y actividades */}
                <Section title="Áreas y Actividades Disponibles">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Áreas Naturales
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                        <li>• Parque Provincial Aconcagua</li>
                        <li>• Reserva Natural Villavicencio</li>
                        <li>• Reserva Laguna del Diamante</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        Actividades
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                        <li>• Trekking y circuitos base</li>
                        <li>• Ascenso a cumbre</li>
                        <li>• Cabalgatas guiadas</li>
                      </ul>
                    </div>
                  </div>
                </Section>

                {/* Accesos de prueba */}
                <Section title="Accesos de Prueba">
                  <p className="mb-3 text-sm text-zinc-600">
                    Use estos accesos predefinidos para probar el sistema:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-200 text-left">
                          <th className="pb-2 font-medium text-zinc-700">Rol</th>
                          <th className="pb-2 font-medium text-zinc-700">Correo</th>
                          <th className="pb-2 font-medium text-zinc-700">Contraseña</th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-600">
                        <tr className="border-b border-zinc-100">
                          <td className="py-2 font-medium text-zinc-800">Super Admin</td>
                          <td className="py-2 font-mono text-xs">super@sistema.local</td>
                          <td className="py-2 font-mono text-xs">super123</td>
                        </tr>
                        <tr className="border-b border-zinc-100">
                          <td className="py-2 font-medium text-zinc-800">Admin ANP</td>
                          <td className="py-2 font-mono text-xs">admin@anp.gob.ar</td>
                          <td className="py-2 font-mono text-xs">admin123</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-medium text-zinc-800">Empresa</td>
                          <td className="py-2 font-mono text-xs">empresa.prestadora@sistema.local</td>
                          <td className="py-2 font-mono text-xs">empresa123</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Section>

                {/* Flujos rápidos */}
                <Section title="Flujos Rápidos">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                        Comprar
                      </p>
                      <ol className="mt-2 space-y-1 text-xs text-zinc-600">
                        <li>1. Ir a "Comprar entradas"</li>
                        <li>2. Elegir lote o personalizada</li>
                        <li>3. Definir fecha (opcional)</li>
                        <li>4. Confirmar compra</li>
                      </ol>
                    </div>
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Asignar
                      </p>
                      <ol className="mt-2 space-y-1 text-xs text-zinc-600">
                        <li>1. Ir a "Compras y asignar"</li>
                        <li>2. Seleccionar compra</li>
                        <li>3. Completar datos</li>
                        <li>4. Confirmar</li>
                      </ol>
                    </div>
                    <div className="rounded-lg bg-zinc-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                        Staff
                      </p>
                      <ol className="mt-2 space-y-1 text-xs text-zinc-600">
                        <li>1. Ir a "Registrar personal"</li>
                        <li>2. Completar datos</li>
                        <li>3. Seleccionar rol y área</li>
                        <li>4. Esperar confirmación</li>
                      </ol>
                    </div>
                  </div>
                </Section>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
