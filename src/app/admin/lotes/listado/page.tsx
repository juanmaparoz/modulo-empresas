import type { Metadata } from "next";
import { ListadoLotesPage } from "@/components/admin/lotes/ListadoLotesPage";

export const metadata: Metadata = {
  title: "Listado de lotes",
  description: "Lotes de entradas por área natural (prototipo).",
};

export default function ListadoLotesRoutePage() {
  return <ListadoLotesPage />;
}
