import type { Metadata } from "next";
import { RegistrarStaffPage } from "@/components/empresa/staff/RegistrarStaffPage";

export const metadata: Metadata = {
  title: "Registrar staff",
  description: "Alta de personal de empresa en ANP (prototipo).",
};

export default function RegistrarStaffRoutePage() {
  return <RegistrarStaffPage />;
}
