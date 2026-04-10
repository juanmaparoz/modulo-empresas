"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth/client-session";
import {
  getAdminByEmail,
  getNombreCompletoAdmin,
  updateAdminPerfil,
  type AdminUser,
} from "@/modules/admins";
import {
  ensureDevEmpresaForCompanyPreset,
  getEmpresa,
  getNombreCompletoUsuario,
  getUsuarioByEmail,
  updateUsuarioPerfil,
  type UsuarioEmpresa,
} from "@/modules/empresas-habilitadas";
import type { AuthSession } from "@/types/auth";

type EditingField = "nombre" | "apellido" | "documento" | "telefono" | null;

function PencilIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

type EditableFieldProps = {
  label: string;
  value: string;
  fieldKey: EditingField;
  editing: EditingField;
  editValue: string;
  onEdit: (field: EditingField) => void;
  onCancel: () => void;
  onSave: () => void;
  onChange: (val: string) => void;
  placeholder?: string;
};

function EditableField({
  label,
  value,
  fieldKey,
  editing,
  editValue,
  onEdit,
  onCancel,
  onSave,
  onChange,
  placeholder,
}: EditableFieldProps) {
  const isEditing = editing === fieldKey;

  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-1 flex items-center gap-2">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full max-w-xs rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
            />
            <button
              type="button"
              onClick={onSave}
              className="rounded p-1.5 text-emerald-600 hover:bg-emerald-50"
              title="Guardar"
            >
              <CheckIcon />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-100"
              title="Cancelar"
            >
              <XIcon />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm text-zinc-900">
              {value || <span className="text-zinc-400">Sin especificar</span>}
            </span>
            <button
              type="button"
              onClick={() => onEdit(fieldKey)}
              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              title="Editar"
            >
              <PencilIcon />
            </button>
          </>
        )}
      </dd>
    </div>
  );
}

type UserData = {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
};

export function EditarPerfilClient() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editing, setEditing] = useState<EditingField>(null);
  const [editValue, setEditValue] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const s = readSession();
    setSession(s);
    if (!s) return;

    if (s.role === "admin_anp") {
      const admin = getAdminByEmail(s.email);
      if (admin) {
        setUserData({
          id: admin.id,
          nombre: admin.nombre,
          apellido: admin.apellido,
          documento: admin.documento,
          telefono: admin.telefono,
        });
      }
    } else if (s.role === "user_companie") {
      // Asegurar que el usuario de desarrollo tenga datos completos
      ensureDevEmpresaForCompanyPreset();
      
      const usuario = getUsuarioByEmail(s.email);
      if (usuario) {
        setUserData({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          documento: usuario.documento,
          telefono: usuario.telefono,
        });
      }
    }
  }, []);

  if (!session) {
    return null;
  }

  const roleLabel =
    session.role === "super_admin"
      ? "Super Admin"
      : session.role === "admin_anp"
        ? "Admin ANP"
        : "Empresa prestadora";

  const empresaNombre = session.empresaId
    ? getEmpresa(session.empresaId)?.nombre ?? session.empresaId
    : null;

  const canEdit = session.role !== "super_admin" && userData;

  function startEdit(field: EditingField) {
    if (!userData || !field) return;
    setEditing(field);
    setEditValue(userData[field] ?? "");
  }

  function cancelEdit() {
    setEditing(null);
    setEditValue("");
  }

  function saveEdit() {
    if (!userData || !editing || !session) return;

    const trimmed = editValue.trim();

    if (session.role === "admin_anp") {
      updateAdminPerfil(userData.id, { [editing]: trimmed });
    } else if (session.role === "user_companie") {
      updateUsuarioPerfil(userData.id, { [editing]: trimmed });
    }

    setUserData((u) => (u ? { ...u, [editing]: trimmed } : null));
    setEditing(null);
    setEditValue("");
    setSuccessMsg("Datos actualizados correctamente.");
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-zinc-300 bg-white p-6 shadow-lg">
      <h2 className="text-lg font-bold text-zinc-900">Mi perfil</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Información de tu cuenta en el sistema.
      </p>

      {successMsg && (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {successMsg}
        </p>
      )}

      <dl className="mt-6 space-y-4">
        {canEdit && userData ? (
          <>
            <EditableField
              label="Nombre"
              value={userData.nombre}
              fieldKey="nombre"
              editing={editing}
              editValue={editValue}
              onEdit={startEdit}
              onCancel={cancelEdit}
              onSave={saveEdit}
              onChange={setEditValue}
              placeholder="Tu nombre"
            />
            <EditableField
              label="Apellido"
              value={userData.apellido}
              fieldKey="apellido"
              editing={editing}
              editValue={editValue}
              onEdit={startEdit}
              onCancel={cancelEdit}
              onSave={saveEdit}
              onChange={setEditValue}
              placeholder="Tu apellido"
            />
            <EditableField
              label="DNI o Pasaporte"
              value={userData.documento}
              fieldKey="documento"
              editing={editing}
              editValue={editValue}
              onEdit={startEdit}
              onCancel={cancelEdit}
              onSave={saveEdit}
              onChange={setEditValue}
              placeholder="Número de documento"
            />
            <EditableField
              label="Teléfono"
              value={userData.telefono}
              fieldKey="telefono"
              editing={editing}
              editValue={editValue}
              onEdit={startEdit}
              onCancel={cancelEdit}
              onSave={saveEdit}
              onChange={setEditValue}
              placeholder="Tu teléfono"
            />
          </>
        ) : null}

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Correo electrónico
          </dt>
          <dd className="mt-1 text-sm text-zinc-900">{session.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Rol
          </dt>
          <dd className="mt-1 text-sm text-zinc-900">{roleLabel}</dd>
        </div>
        {empresaNombre ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Empresa vinculada
            </dt>
            <dd className="mt-1 text-sm text-zinc-900">{empresaNombre}</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-6 border-t border-zinc-100 pt-4">
        <Link
          href="/perfil/cambiar-password"
          className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          Cambiar contraseña
        </Link>
      </div>

      {session.role === "super_admin" && (
        <p className="mt-4 text-xs text-zinc-500">
          El Super Admin utiliza credenciales fijas de desarrollo.
        </p>
      )}
    </div>
  );
}
