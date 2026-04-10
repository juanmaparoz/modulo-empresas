"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { AppShellHeader } from "./AppShellHeader";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

export function AppShell({ children, fallbackTitle }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AppShellHeader
          fallbackTitle={fallbackTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
