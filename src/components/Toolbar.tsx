"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ToolbarGroupProps {
  label?: string;
  children: React.ReactNode;
}

export function ToolbarGroup({ label, children }: ToolbarGroupProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <Label className="text-xs font-semibold tracking-wide text-muted-foreground">
          {label}
        </Label>
      )}
      {children}
    </div>
  );
}

interface ToolbarSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  ariaLabel?: string;
  className?: string;
}

export function ToolbarSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = "",
}: ToolbarSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={className}
        aria-label={ariaLabel ?? "Toolbar select"}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ToolbarCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export function ToolbarCheckbox({
  checked,
  onChange,
  label,
}: ToolbarCheckboxProps) {
  const id = React.useId();
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
      />
      <Label
        htmlFor={id}
        className="cursor-pointer text-[13px] font-normal text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
      </Label>
    </div>
  );
}

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  ariaLabel: string;
}

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as T);
      }}
      variant="outline"
      size="sm"
      aria-label={ariaLabel}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
