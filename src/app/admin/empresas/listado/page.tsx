import type { Metadata } from "next";
import { ListadoEmpresasClient } from "@/components/admin/empresas-habilitadas/ListadoEmpresasClient";

export const metadata: Metadata = {
  title: "Listado de empresas",
  description: "Empresas prestadoras registradas (prototipo).",
};

export default function ListadoEmpresasPage() {
  return <ListadoEmpresasClient />;
}
