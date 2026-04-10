"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { readSession } from "@/lib/auth/client-session";

type Props = {
  children: ReactNode;
};

export function SuperGuard({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "super_admin") {
      router.replace("/home");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-sm text-zinc-600">Verificando permisos...</p>
      </div>
    );
  }

  return <>{children}</>;
}
