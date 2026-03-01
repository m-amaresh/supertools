"use client";

import {
  faAlignLeft,
  faAsterisk,
  faCalculator,
  faCalendarDays,
  faClock,
  faCode,
  faCodeCompare,
  faDiagramProject,
  faFileCode,
  faFingerprint,
  faFont,
  faHashtag,
  faHeading,
  faKey,
  faLink,
  faLock,
  faPalette,
  faPen,
  faRightLeft,
  faShield,
  faTicket,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sidebarToolGroups, type ToolIconKey } from "@/lib/tools";

const iconByKey: Record<ToolIconKey, IconDefinition> = {
  hash: faHashtag,
  key: faKey,
  fingerprint: faFingerprint,
  alignLeft: faAlignLeft,
  code2: faCode,
  calculator: faCalculator,
  heading2: faHeading,
  link2: faLink,
  ticket: faTicket,
  shield: faShield,
  lock: faLock,
  penLine: faPen,
  fileCode: faFileCode,
  arrowLeftRight: faRightLeft,
  palette: faPalette,
  workflow: faDiagramProject,
  gitCompareArrows: faCodeCompare,
  aLargeSmall: faFont,
  asterisk: faAsterisk,
  clock: faClock,
  calendarDays: faCalendarDays,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const isVisible = isDesktop || isOpen;

  return (
    <>
      {!isDesktop && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 w-full border-none bg-foreground/38 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      <aside
        id="sidebar-nav"
        aria-label="Tool navigation"
        aria-hidden={!isVisible}
        inert={!isVisible}
        className={`fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border/80 bg-background/88 backdrop-blur-md transition-transform duration-200 ease-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav aria-label="Tools" className="h-full overflow-y-auto px-4 py-4">
          <div className="space-y-5">
            {sidebarToolGroups.map((category) => (
              <div key={category.name}>
                <h3 className="mb-1.5 border-b border-border/60 px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {category.name}
                </h3>
                <ul className="space-y-0.5">
                  {category.tools.map((tool) => {
                    const isActive = pathname === tool.href;
                    const isAvailable = tool.available;
                    const icon = iconByKey[tool.icon];

                    return (
                      <li key={tool.href}>
                        {isAvailable ? (
                          <Link
                            href={tool.href}
                            onClick={onClose}
                            aria-current={isActive ? "page" : undefined}
                            className={`flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/25"
                                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            }`}
                          >
                            <span
                              className={
                                isActive ? "opacity-100" : "opacity-80"
                              }
                            >
                              <FontAwesomeIcon
                                icon={icon}
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                            {tool.sidebarLabel}
                          </Link>
                        ) : (
                          <span className="flex min-h-10 cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-muted-foreground/60">
                            <span className="opacity-50">
                              <FontAwesomeIcon
                                icon={icon}
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                            {tool.sidebarLabel}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
