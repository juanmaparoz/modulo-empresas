"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { readSession } from "@/lib/auth/client-session";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const session = readSession();
    router.replace(session ? "/home" : "/login");
  }, [router]);

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-100 text-sm text-zinc-500">
      Redirigiendo…
    </div>
  );
}
