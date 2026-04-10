"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readSession } from "@/lib/auth/client-session";

type Props = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "admin_anp") {
      router.replace("/home");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-zinc-500">
        Verificando permisos…
      </div>
    );
  }

  return <>{children}</>;
}
