/** Recuerda la última empresa abierta en la vista de usuarios (solo prototipo, sessionStorage). */
const KEY = "sio.admin.ultimaEmpresaUsuarios";

export function setUltimaEmpresaUsuariosPage(empresaId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, empresaId);
}

export function getUltimaEmpresaUsuariosPage(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}
