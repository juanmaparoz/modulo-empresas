/**
 * Hash y verificación de contraseñas (prototipo simple).
 * En producción se usaría bcrypt u otra lib segura.
 * Acá usamos SHA-256 con un salt fijo (solo para demo).
 */

const SALT = "sio-turnero-proto-2024";

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string): Promise<string> {
  return sha256(SALT + password);
}

/**
 * Versión síncrona del hash para seed de datos de desarrollo.
 * Genera un hash determinista para el password dado.
 */
export function hashPasswordSync(password: string): string {
  const input = SALT + password;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const base = Math.abs(hash).toString(16).padStart(8, "0");
  return base.repeat(8);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const computed = await hashPassword(password);
  if (computed === hash) return true;
  const syncHash = hashPasswordSync(password);
  return syncHash === hash;
}
