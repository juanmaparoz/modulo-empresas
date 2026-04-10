"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { StaffCreateForm } from "./StaffCreateForm";

type Props = {
  empresaId: string;
};

export function RegistrarStaffClient({ empresaId }: Props) {
  const router = useRouter();

  const onCreated = useCallback(() => {
    router.push("/empresa/staff/listado");
  }, [router]);

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">Registrar personal</h1>
      <p className="mt-1 max-w-2xl text-sm text-zinc-600">
        Datos de la persona, rol y área/actividad donde queda habilitado.
      </p>
      <div className="mt-6">
        <StaffCreateForm empresaId={empresaId} onCreated={onCreated} />
      </div>
    </div>
  );
}
