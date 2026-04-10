import type { Metadata } from "next";
import { RecuperarPasswordForm } from "@/components/auth/RecuperarPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  description: "Recuperar acceso a tu cuenta.",
};

export default function RecuperarPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-900">
          Recuperar contraseña
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Ingresá tu correo y te enviaremos instrucciones (simulación en
          prototipo).
        </p>
        <div className="mt-6">
          <RecuperarPasswordForm />
        </div>
      </div>
    </div>
  );
}
