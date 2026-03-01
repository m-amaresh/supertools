"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
  version: string;
}

const THEME_MODES = ["light", "dark", "system"] as const;

export function AppShell({ children, version }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const resolvedThemeMode = (theme ?? "system") as "light" | "dark" | "system";
  const themeMode = mounted ? resolvedThemeMode : "system";
  const isDarkMode = mounted ? resolvedTheme === "dark" : false;

  const cycleThemeMode = () => {
    const currentIndex = THEME_MODES.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % THEME_MODES.length;
    setTheme(THEME_MODES[nextIndex]);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--shell-bg)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-28 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-linear-to-r from-cyan-200/45 via-sky-200/35 to-emerald-200/45 blur-3xl dark:from-cyan-900/20 dark:via-sky-900/20 dark:to-emerald-900/20" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-100/35 blur-3xl dark:bg-muted/40" />
      </div>

      <Header
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
        mounted={mounted}
        themeMode={themeMode}
        isDarkMode={isDarkMode}
        onThemeToggle={cycleThemeMode}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ServiceWorkerRegistration />

      <main id="main-content" className="pt-14 lg:pl-64">
        <div className="min-h-[calc(100vh-3.5rem)]">
          <div className="mx-auto w-full max-w-[1680px] px-3 py-3 sm:px-5 sm:py-5 lg:px-7">
            {children}
          </div>
          <footer className="mx-auto w-full max-w-[1680px] px-3 pb-4 sm:px-5 lg:px-7">
            <div className="border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
              SuperTools v{version}
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
