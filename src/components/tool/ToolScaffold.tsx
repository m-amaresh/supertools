import type * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ClassNameProps {
  className?: string;
}

interface ToolPageProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolPage({ children, className }: ToolPageProps) {
  return <div className={cn("p-1 lg:p-2", className)}>{children}</div>;
}

interface ToolHeaderProps extends ClassNameProps {
  title: string;
  description: string;
}

export function ToolHeader({ title, description, className }: ToolHeaderProps) {
  return (
    <header className={cn("mb-6", className)}>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

interface ToolCardProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolCard({ children, className }: ToolCardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ToolToolbarProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolToolbar({ children, className }: ToolToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ToolOptionsBarProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolOptionsBar({ children, className }: ToolOptionsBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border bg-muted/30 px-4 py-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ToolStatusStackProps
  extends React.PropsWithChildren,
    ClassNameProps {}

export function ToolStatusStack({ children, className }: ToolStatusStackProps) {
  return (
    <div
      data-slot="tool-status-stack"
      className={cn("peer mx-4 mt-4 space-y-2", className)}
    >
      {children}
    </div>
  );
}

interface ToolBodyProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolBody({ children, className }: ToolBodyProps) {
  return (
    <div
      className={cn(
        "space-y-4 p-4 peer-data-[slot=tool-status-stack]:pt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ToolFootnoteProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolFootnote({ children, className }: ToolFootnoteProps) {
  return (
    <p
      className={cn(
        "mt-4 text-[12px] leading-relaxed text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

interface ToolLabelProps extends React.PropsWithChildren, ClassNameProps {
  htmlFor?: string;
}

export function ToolLabel({ children, className, htmlFor }: ToolLabelProps) {
  return (
    <Label
      htmlFor={htmlFor}
      className={cn(
        "mb-2 text-[13px] font-semibold tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </Label>
  );
}

interface ToolMetaProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolMeta({ children, className }: ToolMetaProps) {
  return (
    <span
      className={cn("text-[13px] font-medium text-muted-foreground", className)}
    >
      {children}
    </span>
  );
}

interface ToolCodeBlockProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolCodeBlock({ children, className }: ToolCodeBlockProps) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-md border border-border bg-muted/25 p-3 font-mono text-[13px] leading-relaxed text-foreground",
        className,
      )}
    >
      {children}
    </pre>
  );
}
