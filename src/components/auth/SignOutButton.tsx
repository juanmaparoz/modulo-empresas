"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth/client-session";

type Props = {
  className?: string;
};

export function SignOutButton({ className }: Props) {
  const router = useRouter();

  function handleClick() {
    clearSession();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
      }
    >
      Cerrar sesión
    </button>
  );
}
