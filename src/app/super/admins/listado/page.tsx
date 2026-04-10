import type { Metadata } from "next";
import { ListadoAdminsClient } from "@/components/super/ListadoAdminsClient";

export const metadata: Metadata = {
  title: "Listado de administradores",
  description: "Administradores ANP del sistema.",
};

export default function ListadoAdminsPage() {
  return <ListadoAdminsClient />;
}
