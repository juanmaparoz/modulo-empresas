"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth/client-session";

type Props = {
  children: (empresaId: string) => React.ReactNode;
};

export function EmpresaIdShell({ children }: Props) {
  const router = useRouter();
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  useEffect(() => {
    const session = readSession();
    if (!session?.empresaId) {
      router.replace("/home");
      return;
    }
    setEmpresaId(session.empresaId);
  }, [router]);

  if (!empresaId) {
    return (
      <p className="text-sm text-zinc-500">Cargando empresa…</p>
    );
  }

  return <>{children(empresaId)}</>;
}
