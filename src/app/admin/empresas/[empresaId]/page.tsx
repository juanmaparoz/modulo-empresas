import type { Metadata } from "next";
import { EmpresaDetalleView } from "@/components/admin/empresas-habilitadas/EmpresaDetalleView";

type Props = {
  params: Promise<{ empresaId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { empresaId } = await params;
  return {
    title: "Detalle empresa",
    description: `Gestión de empresa ${empresaId} (prototipo).`,
  };
}

export default async function EmpresaDetallePage({ params }: Props) {
  const { empresaId } = await params;
  return <EmpresaDetalleView empresaId={empresaId} />;
}
