import type { Metadata } from "next";
import { RegistrarLotePage } from "@/components/admin/lotes/RegistrarLotePage";

export const metadata: Metadata = {
  title: "Registrar lote",
  description: "Alta de lote de entradas por ANP (prototipo).",
};

export default function RegistrarLoteRoutePage() {
  return <RegistrarLotePage />;
}
