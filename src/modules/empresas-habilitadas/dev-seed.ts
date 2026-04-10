import { getDevPreset } from "@/constants/dev-auth";
import { hashPasswordSync } from "@/lib/auth/password";
import { AREAS_NATURALES_PROTOTIPO } from "./areas-naturales";
import {
  createEmpresa,
  createUsuarioEmpresa,
  findEmpresaIdByContactEmail,
  getUsuarioByEmail,
  updateUsuarioPerfil,
} from "./repository";

/**
 * Prototipo: crea en localStorage una empresa de demo con el correo del preset
 * `user_companie`, si aún no existe. Idempotente.
 * También crea o actualiza el usuario de empresa asociado.
 */
export function ensureDevEmpresaForCompanyPreset(): void {
  if (typeof window === "undefined") return;

  const preset = getDevPreset("user_companie");
  if (!preset) return;

  let empresaId = findEmpresaIdByContactEmail(preset.email);

  if (!empresaId) {
    const desde = new Date();
    const hasta = new Date(desde);
    hasta.setFullYear(hasta.getFullYear() + 1);

    const iso = (d: Date) => d.toISOString().slice(0, 10);

    const empresa = createEmpresa({
      nombre: "Prestador Demo S.A.",
      cuit: "30712345678",
      email: preset.email.trim().toLowerCase(),
      autorizacionDesde: iso(desde),
      autorizacionHasta: iso(hasta),
      areasNaturalesIds: [...AREAS_NATURALES_PROTOTIPO.map((a) => a.id)],
    });
    empresaId = empresa.id;
  }

  // Crear usuario de empresa si no existe
  const existingUser = getUsuarioByEmail(preset.email);
  if (!existingUser && empresaId) {
    createUsuarioEmpresa({
      empresaId,
      nombre: "Usuario",
      apellido: "Demo",
      documento: "12345678",
      telefono: "1122334455",
      email: preset.email.trim().toLowerCase(),
      habilitado: true,
      passwordHash: hashPasswordSync(preset.password),
    });
  } else if (existingUser && !existingUser.nombre && !existingUser.documento) {
    // Actualizar usuario existente con datos de demo si están vacíos
    updateUsuarioPerfil(existingUser.id, {
      nombre: "Usuario",
      apellido: "Demo",
      documento: "12345678",
      telefono: "1122334455",
    });
  }
}
