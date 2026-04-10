"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { readSession } from "@/lib/auth/client-session";
import type { AuthSession, UserRole } from "@/types/auth";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

function getNavItems(role: UserRole): NavItem[] {
  if (role === "super_admin") {
    return [
      {
        label: "Administradores",
        href: "/super/admins/listado",
        children: [
          { label: "Listado", href: "/super/admins/listado" },
          { label: "Crear", href: "/super/admins/crear" },
        ],
      },
    ];
  }

  if (role === "admin_anp") {
    return [
      {
        label: "Empresas",
        href: "/admin/empresas/listado",
        children: [
          { label: "Listado", href: "/admin/empresas/listado" },
          { label: "Registrar", href: "/admin/empresas/registrar" },
        ],
      },
      {
        label: "Lotes",
        href: "/admin/lotes/listado",
        children: [
          { label: "Listado", href: "/admin/lotes/listado" },
          { label: "Registrar", href: "/admin/lotes/registrar" },
        ],
      },
    ];
  }

  return [
    {
      label: "Entradas",
      href: "/empresa/entradas/comprar",
      children: [
        { label: "Comprar", href: "/empresa/entradas/comprar" },
        { label: "Compras y asignar", href: "/empresa/entradas/mis-compras" },
        { label: "Asignadas", href: "/empresa/entradas/asignadas" },
      ],
    },
    {
      label: "Staff",
      href: "/empresa/staff/listado",
      children: [
        { label: "Listado", href: "/empresa/staff/listado" },
        { label: "Registrar", href: "/empresa/staff/registrar" },
      ],
    },
  ];
}

function ExpandableChildren({
  children,
  isExpanded,
}: {
  children: React.ReactNode;
  isExpanded: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div
      className="overflow-hidden transition-all duration-300 ease-in-out"
      style={{ maxHeight: isExpanded ? height : 0, opacity: isExpanded ? 1 : 0 }}
    >
      <div ref={contentRef} className="pt-1">
        {children}
      </div>
    </div>
  );
}

function NavLink({
  item,
  pathname,
  depth = 0,
  onNavigate,
  isExpanded,
  onToggle,
}: {
  item: NavItem;
  pathname: string;
  depth?: number;
  onNavigate?: () => void;
  isExpanded?: boolean;
  onToggle?: () => void;
}) {
  const isExactActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;
  const childActive =
    hasChildren &&
    item.children!.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
    );

  const isActive = depth === 0 ? (isExpanded || childActive) : isExactActive;

  function handleClick(e: React.MouseEvent) {
    if (hasChildren && depth === 0 && onToggle) {
      e.preventDefault();
      onToggle();
    } else if (onNavigate) {
      onNavigate();
    }
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={handleClick}
        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all duration-200 ${
          depth === 0 ? "font-medium" : "ml-4 text-xs"
        } ${
          isActive
            ? depth === 0
              ? "bg-indigo-600 text-white"
              : "border-l-2 border-indigo-500 bg-indigo-50 font-medium text-indigo-900"
            : "text-zinc-700 hover:bg-zinc-100"
        }`}
      >
        {item.label}
        {hasChildren && depth === 0 ? (
          <svg
            className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : null}
      </Link>
      {hasChildren ? (
        <ExpandableChildren isExpanded={isExpanded ?? false}>
          <ul className="space-y-1">
            {item.children!.map((child) => (
              <NavLink
                key={child.href}
                item={child}
                pathname={pathname}
                depth={depth + 1}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </ExpandableChildren>
      ) : null}
    </li>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSession(readSession());
  }, []);

  const navItems = session ? getNavItems(session.role) : [];

  useEffect(() => {
    const newExpanded = new Set<string>();
    for (const item of navItems) {
      if (item.children) {
        const childActive = item.children.some(
          (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
        );
        if (childActive) {
          newExpanded.add(item.href);
        }
      }
    }
    setExpandedItems(newExpanded);
  }, [pathname, navItems.length]);

  function toggleItem(href: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(href)) {
        next.delete(href);
      } else {
        next.add(href);
      }
      return next;
    });
  }

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4">
          <span className="text-sm font-semibold text-zinc-900">
            SIO Turnero
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 lg:hidden"
            aria-label="Cerrar menú"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={onClose}
                isExpanded={expandedItems.has(item.href)}
                onToggle={() => toggleItem(item.href)}
              />
            ))}
          </ul>
        </nav>

        {session ? (
          <div className="shrink-0 border-t border-zinc-200 px-4 py-3">
            <p className="truncate text-xs text-zinc-500">
              {session.email}
            </p>
            <p className="text-xs font-medium text-zinc-700">
              {session.role === "super_admin"
                ? "Super Admin"
                : session.role === "admin_anp"
                  ? "Admin ANP"
                  : "Empresa"}
            </p>
          </div>
        ) : null}
      </aside>
    </>
  );
}
