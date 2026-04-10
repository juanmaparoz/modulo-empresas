import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { RedirectIfAuthed } from "@/components/auth/RedirectIfAuthed";
import { ManualUsuarioModal } from "@/components/ui/ManualUsuarioModal";

export const metadata: Metadata = {
  title: "Ingreso — Sistema Turnero (prestadores)",
  description: "Acceso para administración ANP y empresas prestadoras.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-100">
      <RedirectIfAuthed />
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-900">
            Sistema Turnero — Módulo prestadores
          </p>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
            Prototipo
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-6 pb-16 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Ingresar
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-600">
            Ingresá con correo y contraseña; el sistema reconoce el perfil según
            tus credenciales. En prototipo podés usar los accesos rápidos para
            rellenar datos de prueba.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </main>

      <ManualUsuarioModal />
    </div>
  );
}
