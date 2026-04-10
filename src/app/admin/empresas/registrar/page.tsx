import type { Metadata } from "next";
import { RegistrarEmpresaClient } from "@/components/admin/empresas-habilitadas/RegistrarEmpresaClient";

export const metadata: Metadata = {
  title: "Registrar empresa",
  description: "Alta de empresa prestadora habilitada en ANP (prototipo).",
};

export default function RegistrarEmpresaPage() {
  return <RegistrarEmpresaClient />;
}
