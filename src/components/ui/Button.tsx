"use client";

import { Spinner } from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  children: React.ReactNode;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary:
    "border border-zinc-300 bg-white text-zinc-800 hover:border-indigo-300 hover:bg-indigo-50",
  danger: "border border-red-200 bg-white text-red-800 hover:bg-red-50",
  ghost: "text-zinc-700 hover:bg-zinc-100",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-200 disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    >
      {loading ? <Spinner className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
