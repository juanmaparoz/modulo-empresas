import type { Metadata } from "next";
import { ListadoStaffPage } from "@/components/empresa/staff/ListadoStaffPage";

export const metadata: Metadata = {
  title: "Listado de Staff",
  description: "Personal de empresa por área y actividad (prototipo).",
};

export default function ListadoStaffRoutePage() {
  return <ListadoStaffPage />;
}
