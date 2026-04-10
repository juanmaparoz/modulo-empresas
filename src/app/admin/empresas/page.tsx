import { redirect } from "next/navigation";

export default function EmpresasIndexPage() {
  redirect("/admin/empresas/listado");
}
