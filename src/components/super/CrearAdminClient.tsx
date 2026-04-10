"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { hashPassword } from "@/lib/auth/password";
import { createAdmin, getAdminByEmail } from "@/modules/admins";

export function CrearAdminClient() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nombreTrim = nombre.trim();
    const apellidoTrim = apellido.trim();
    const documentoTrim = documento.trim();
    const telefonoTrim = telefono.trim();
    const correo = email.trim().toLowerCase();

    if (!nombreTrim || !apellidoTrim) {
      setError("Completá nombre y apellido.");
      return;
    }

    if (!documentoTrim) {
      setError("El documento es obligatorio.");
      return;
    }

    if (!telefonoTrim) {
      setError("El teléfono es obligatorio.");
      return;
    }

    if (!correo) {
      setError("El correo es obligatorio.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    const existing = getAdminByEmail(correo);
    if (existing) {
      setError("Ya existe un administrador con ese correo.");
      return;
    }

    setLoading(true);
    try {
      const passwordHash = await hashPassword(password);
      createAdmin({
        nombre: nombreTrim,
        apellido: apellidoTrim,
        documento: documentoTrim,
        telefono: telefonoTrim,
        email: correo,
        passwordHash,
        habilitado: true,
      });
      router.push("/super/admins/listado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Crear administrador
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        El nuevo admin accede con correo y contraseña.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-6 grid w-full max-w-4xl gap-4 rounded-lg border border-zinc-300 bg-white p-6 shadow-lg sm:grid-cols-2 lg:p-8"
        noValidate
      >
        <div>
          <label
            className="text-sm font-semibold text-zinc-800"
            htmlFor="adm-nombre"
          >
            Nombre
          </label>
          <input
            id="adm-nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-zinc-800"
            htmlFor="adm-apellido"
          >
            Apellido
          </label>
          <input
            id="adm-apellido"
            required
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-zinc-800"
            htmlFor="adm-doc"
          >
            DNI o Pasaporte
          </label>
          <input
            id="adm-doc"
            required
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-zinc-800"
            htmlFor="adm-tel"
          >
            Teléfono
          </label>
          <input
            id="adm-tel"
            type="tel"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-zinc-800"
            htmlFor="adm-email"
          >
            Correo
          </label>
          <input
            id="adm-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>

        <div>
          <label
            className="text-sm font-semibold text-zinc-800"
            htmlFor="adm-pass"
          >
            Contraseña
          </label>
          <div className="mt-1">
            <PasswordInput
              id="adm-pass"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-700 sm:col-span-2" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex justify-end sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear administrador"}
          </button>
        </div>
      </form>
    </div>
  );
}
