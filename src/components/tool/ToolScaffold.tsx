import type * as React from "react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ClassNameProps {
  className?: string;
}

interface ToolPageProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolPage({ children, className }: ToolPageProps) {
  return (
    <div className={cn("p-1 lg:p-2", className)}>
      <div className="w-full">{children}</div>
    </div>
  );
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
    <Card className={cn("gap-0 overflow-hidden rounded-2xl py-0", className)}>
      {children}
    </Card>
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
        "flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border bg-muted/40 px-4 py-3",
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
    <div className={cn("tool-status-stack mx-4 mt-4 space-y-2", className)}>
      {children}
    </div>
  );
}

interface ToolBodyProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolBody({ children, className }: ToolBodyProps) {
  return (
    <div className={cn("tool-body space-y-4 p-4", className)}>{children}</div>
  );
}

interface ToolFootnoteProps extends React.PropsWithChildren, ClassNameProps {}

export function ToolFootnote({ children, className }: ToolFootnoteProps) {
  return (
    <p className={cn("mt-4 text-[11px] text-muted-foreground/88", className)}>
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
        "mb-2 text-xs font-semibold tracking-wide text-muted-foreground",
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
      className={cn("text-xs font-medium text-muted-foreground", className)}
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
        "overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-[13px] leading-relaxed text-foreground",
        className,
      )}
    >
      {children}
    </pre>
  );
}
