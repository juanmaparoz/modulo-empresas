import type { Metadata } from "next";
import { CambiarPasswordForm } from "@/components/auth/CambiarPasswordForm";

export const metadata: Metadata = {
  title: "Cambiar contraseña",
  description: "Establecer nueva contraseña.",
};

export default async function CambiarPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email ?? "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-zinc-900">
          Cambiar contraseña
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Ingresá tu nueva contraseña.
        </p>
        <div className="mt-6">
          <CambiarPasswordForm initialEmail={email} />
        </div>
      </div>
    </div>
  );
}
