import type { Metadata } from "next";
import { ComprarEntradasPage } from "@/components/empresa/entradas/ComprarEntradasPage";

export const metadata: Metadata = {
  title: "Comprar entradas",
  description: "Compra por lote o individual (prototipo).",
};

export default function ComprarEntradasRoutePage() {
  return <ComprarEntradasPage />;
}
