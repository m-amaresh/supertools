"use client";

import {
  faCircleCheck,
  faCircleExclamation,
  faTriangleExclamation,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type AlertVariant = "error" | "warn" | "success";

interface AlertBoxProps {
  variant: AlertVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_ICONS: Record<AlertVariant, IconDefinition> = {
  error: faCircleExclamation,
  warn: faTriangleExclamation,
  success: faCircleCheck,
};

export function AlertBox({ variant, children, className = "" }: AlertBoxProps) {
  const icon = VARIANT_ICONS[variant];
  return (
    <Alert
      variant={variant}
      className={cn("flex items-start gap-2", className)}
    >
      <FontAwesomeIcon
        icon={icon}
        className="mt-0.5 h-3.5 w-3.5 shrink-0"
        aria-hidden={true}
      />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
