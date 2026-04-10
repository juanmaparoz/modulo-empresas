import type { ReactNode } from "react";

export default function EmpresasLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-5xl pb-16">{children}</div>;
}
