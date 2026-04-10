"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { hashPassword } from "@/lib/auth/password";
import {
  createUsuarioEmpresa,
  getEmpresa,
  getNombreCompletoUsuario,
  listUsuariosPorEmpresa,
  type UsuarioEmpresa,
} from "@/modules/empresas-habilitadas";

type Props = {
  empresaId: string;
};

export function EmpresaUsuariosPanel({ empresaId }: Props) {
  const empresa = useMemo(() => getEmpresa(empresaId), [empresaId]);

  const [usuarioForm, setUsuarioForm] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [usuarioError, setUsuarioError] = useState<string | null>(null);
  const [usuarios, setUsuarios] = useState<UsuarioEmpresa[]>([]);
  const [creando, setCreando] = useState(false);

  const refreshUsuarios = useCallback(() => {
    setUsuarios(listUsuariosPorEmpresa(empresaId));
  }, [empresaId]);

  useEffect(() => {
    refreshUsuarios();
  }, [refreshUsuarios]);

  if (!empresa) {
    return null;
  }

  async function handleCreateUsuario(e: React.FormEvent) {
    e.preventDefault();
    setUsuarioError(null);

    const nombre = usuarioForm.nombre.trim();
    const apellido = usuarioForm.apellido.trim();
    const documento = usuarioForm.documento.trim();
    const telefono = usuarioForm.telefono.trim();
    const email = usuarioForm.email.trim().toLowerCase();
    const password = usuarioForm.password;

    if (!nombre || !apellido) {
      setUsuarioError("Completá nombre y apellido del usuario.");
      return;
    }

    if (!documento) {
      setUsuarioError("El documento es obligatorio.");
      return;
    }

    if (!telefono) {
      setUsuarioError("El teléfono es obligatorio.");
      return;
    }

    if (!email) {
      setUsuarioError("El correo es obligatorio.");
      return;
    }

    if (password.length < 6) {
      setUsuarioError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCreando(true);
    try {
      const passwordHash = await hashPassword(password);
      createUsuarioEmpresa({
        empresaId,
        nombre,
        apellido,
        documento,
        telefono,
        email,
        habilitado: true,
        passwordHash,
      });
      setUsuarioForm({
        nombre: "",
        apellido: "",
        documento: "",
        telefono: "",
        email: "",
        password: "",
      });
      refreshUsuarios();
    } finally {
      setCreando(false);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900">
        Usuarios de {empresa.nombre}
      </h3>

      <form
        onSubmit={handleCreateUsuario}
        className="mt-4 grid max-w-4xl gap-3 sm:grid-cols-2"
      >
        <div>
          <label
            className="text-sm font-medium text-zinc-800"
            htmlFor="unombre"
          >
            Nombre
          </label>
          <input
            id="unombre"
            required
            value={usuarioForm.nombre}
            onChange={(ev) =>
              setUsuarioForm((f) => ({
                ...f,
                nombre: ev.target.value,
              }))
            }
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>
        <div>
          <label
            className="text-sm font-medium text-zinc-800"
            htmlFor="uapellido"
          >
            Apellido
          </label>
          <input
            id="uapellido"
            required
            value={usuarioForm.apellido}
            onChange={(ev) =>
              setUsuarioForm((f) => ({
                ...f,
                apellido: ev.target.value,
              }))
            }
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="udoc">
            DNI o Pasaporte
          </label>
          <input
            id="udoc"
            required
            value={usuarioForm.documento}
            onChange={(ev) =>
              setUsuarioForm((f) => ({ ...f, documento: ev.target.value }))
            }
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="utel">
            Teléfono
          </label>
          <input
            id="utel"
            type="tel"
            required
            value={usuarioForm.telefono}
            onChange={(ev) =>
              setUsuarioForm((f) => ({ ...f, telefono: ev.target.value }))
            }
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="uemail">
            Correo
          </label>
          <input
            id="uemail"
            type="email"
            required
            value={usuarioForm.email}
            onChange={(ev) =>
              setUsuarioForm((f) => ({ ...f, email: ev.target.value }))
            }
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/30"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="upass">
            Contraseña inicial
          </label>
          <div className="mt-1">
            <PasswordInput
              id="upass"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              value={usuarioForm.password}
              onChange={(ev) =>
                setUsuarioForm((f) => ({ ...f, password: ev.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end sm:col-span-2">
          <button
            type="submit"
            disabled={creando}
            className="inline-flex h-10 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {creando ? "Creando..." : "Agregar usuario"}
          </button>
        </div>
      </form>

      {usuarioError ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {usuarioError}
        </p>
      ) : null}

      <ul className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200">
        {usuarios.length === 0 ? (
          <li className="py-4 text-sm text-zinc-500">
            No hay usuarios para esta empresa.
          </li>
        ) : (
          usuarios.map((u) => (
            <li
              key={u.id}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-semibold text-zinc-900">
                  {getNombreCompletoUsuario(u)}
                </span>
                {u.documento ? (
                  <span className="ml-2 text-sm text-zinc-500">
                    DNI: {u.documento}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="text-sm text-zinc-600">{u.email}</span>
                {u.telefono ? (
                  <span className="text-sm text-zinc-500">Tel: {u.telefono}</span>
                ) : null}
                {u.habilitado ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    Activo
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Deshabilitado
                  </span>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
