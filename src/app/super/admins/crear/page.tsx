import type { Metadata } from "next";
import { CrearAdminClient } from "@/components/super/CrearAdminClient";

export const metadata: Metadata = {
  title: "Crear administrador",
  description: "Alta de nuevo administrador ANP.",
};

export default function CrearAdminPage() {
  return <CrearAdminClient />;
}
