"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { readSession } from "@/lib/auth/client-session";

export function RedirectIfAuthed() {
  const router = useRouter();

  useEffect(() => {
    if (readSession()) {
      router.replace("/home");
    }
  }, [router]);

  return null;
}
