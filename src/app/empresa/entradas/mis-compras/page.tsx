import type { Metadata } from "next";
import { MisComprasPage } from "@/components/empresa/entradas/MisComprasPage";

export const metadata: Metadata = {
  title: "Mis compras",
  description: "Historial de compras de entradas (prototipo).",
};

export default function MisComprasRoutePage() {
  return <MisComprasPage />;
}
