"use client";

import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertBox } from "@/components/AlertBox";
import { CopyButton } from "@/components/CopyButton";
import {
  SegmentedControl,
  ToolbarGroup,
  ToolbarSelect,
} from "@/components/Toolbar";
import {
  ToolBody,
  ToolCard,
  ToolFootnote,
  ToolHeader,
  ToolLabel,
  ToolMeta,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClipboard } from "@/hooks/useClipboard";
import { useToolState } from "@/hooks/useToolState";
import { cronPresets, parseCron } from "@/lib/cron";

function formatDate(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

const FIELD_LABELS = ["Minute", "Hour", "Day (month)", "Month", "Day (week)"];
const FIELD_RANGES = ["0-59", "0-23", "1-31", "1-12", "0-6 (Sun=0)"];

const minuteBuilderOptions = [
  { value: "*", label: "Every minute (*)" },
  { value: "0", label: "At minute 0" },
  { value: "*/5", label: "Every 5 minutes" },
  { value: "*/10", label: "Every 10 minutes" },
  { value: "*/15", label: "Every 15 minutes" },
  { value: "*/30", label: "Every 30 minutes" },
];

const hourBuilderOptions = [
  { value: "*", label: "Every hour (*)" },
  { value: "0", label: "00:00 hour" },
  { value: "6", label: "06:00 hour" },
  { value: "9", label: "09:00 hour" },
  { value: "12", label: "12:00 hour" },
  { value: "18", label: "18:00 hour" },
  { value: "*/2", label: "Every 2 hours" },
  { value: "*/6", label: "Every 6 hours" },
];

const dayOfMonthBuilderOptions = [
  { value: "*", label: "Every day of month (*)" },
  { value: "1", label: "1st day" },
  { value: "15", label: "15th day" },
  { value: "28", label: "28th day" },
];

const monthBuilderOptions = [
  { value: "*", label: "Every month (*)" },
  { value: "1", label: "January" },
  { value: "4", label: "April" },
  { value: "7", label: "July" },
  { value: "10", label: "October" },
  { value: "12", label: "December" },
];

const dayOfWeekBuilderOptions = [
  { value: "*", label: "Every day (*)" },
  { value: "1-5", label: "Weekdays (Mon-Fri)" },
  { value: "0,6", label: "Weekend (Sun,Sat)" },
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

interface CronBuilderState {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

interface CronBuilderTemplate {
  name: string;
  fields: CronBuilderState;
}

const builderTemplates: CronBuilderTemplate[] = [
  {
    name: "Every 15 min",
    fields: {
      minute: "*/15",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    },
  },
  {
    name: "Hourly",
    fields: {
      minute: "0",
      hour: "*",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    },
  },
  {
    name: "Daily 09:00",
    fields: {
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "*",
    },
  },
  {
    name: "Weekdays 09:00",
    fields: {
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5",
    },
  },
  {
    name: "Monthly 1st 00:00",
    fields: {
      minute: "0",
      hour: "0",
      dayOfMonth: "1",
      month: "*",
      dayOfWeek: "*",
    },
  },
  {
    name: "Sunday Noon",
    fields: {
      minute: "0",
      hour: "12",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "0",
    },
  },
];

export default function CronParser() {
  const { readText, pasteError } = useClipboard();
  const [{ input }, { setInput, handleClear }] = useToolState();

  const [viewMode, setViewMode] = useState<"parser" | "builder">("parser");
  const [mounted, setMounted] = useState(false);
  const [builder, setBuilder] = useState<CronBuilderState>({
    minute: "0",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const result = useMemo(() => parseCron(input), [input]);

  const handlePreset = useCallback(
    (expression: string) => {
      setViewMode("parser");
      setInput(expression);
    },
    [setInput],
  );

  const handleBuilderApply = useCallback(() => {
    const expression = [
      builder.minute,
      builder.hour,
      builder.dayOfMonth,
      builder.month,
      builder.dayOfWeek,
    ].join(" ");
    setViewMode("parser");
    setInput(expression);
  }, [builder, setInput]);

  const handleBuilderTemplate = useCallback((template: CronBuilderTemplate) => {
    setBuilder(template.fields);
  }, []);

  useEffect(() => {
    const parts = input.trim().split(/\s+/);
    if (parts.length !== 5) return;
    setBuilder({
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4],
    });
  }, [input]);

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) {
      setViewMode("parser");
      setInput(text);
    }
  }, [readText, setInput]);

  const fields = input.trim().split(/\s+/);
  const hasFields = fields.length === 5 && input.trim().length > 0;
  const builderExpression = [
    builder.minute,
    builder.hour,
    builder.dayOfMonth,
    builder.month,
    builder.dayOfWeek,
  ].join(" ");
  const builderResult = useMemo(
    () => parseCron(builderExpression),
    [builderExpression],
  );

  return (
    <ToolPage>
      <ToolHeader
        title="Cron Parser & Builder"
        description="Build and parse cron expressions with human-readable descriptions and next run times"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            <SegmentedControl
              value={viewMode}
              onChange={(value) => setViewMode(value as "parser" | "builder")}
              ariaLabel="Cron page mode"
              options={[
                { value: "parser", label: "Parser" },
                { value: "builder", label: "Builder" },
              ]}
            />
            {viewMode === "parser" && result.description && (
              <CopyButton text={result.description} />
            )}
            {viewMode === "builder" && <CopyButton text={builderExpression} />}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={handlePaste}>
              <FontAwesomeIcon
                icon={faPaste}
                className="h-3 w-3"
                aria-hidden="true"
              />
              Paste
            </Button>
            {input && (
              <Button type="button" variant="ghost" onClick={handleClear}>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                Clear
              </Button>
            )}
          </div>
        </ToolToolbar>

        <ToolStatusStack>
          {pasteError && (
            <AlertBox variant="error">
              <span>
                Clipboard access denied — use Ctrl+V / Cmd+V to paste directly.
              </span>
            </AlertBox>
          )}
          {viewMode === "parser" && result.error && (
            <AlertBox variant="error">
              <span>{result.error}</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody>
          {viewMode === "parser" ? (
            <>
              <ToolMeta>
                Standard 5-field cron format: minute hour day month weekday
              </ToolMeta>

              <div>
                <ToolLabel htmlFor="cron-expression">Cron Expression</ToolLabel>
                <Input
                  id="cron-expression"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="* * * * *"
                  aria-label="Cron expression"
                  className="h-10 text-[14px] tracking-wider font-mono"
                  spellCheck={false}
                />

                {hasFields && (
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {FIELD_LABELS.map((label, i) => (
                      <div key={label} className="text-center">
                        <code className="block font-mono text-[13px] font-medium text-foreground">
                          {fields[i]}
                        </code>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          {label}
                        </span>
                        <span className="block text-[9px] text-muted-foreground/80">
                          {FIELD_RANGES[i]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <ToolLabel>Common Expressions</ToolLabel>
                <div className="flex flex-wrap gap-1.5">
                  {cronPresets.map((preset) => (
                    <Button
                      key={preset.expression}
                      type="button"
                      onClick={() => handlePreset(preset.expression)}
                      title={preset.expression}
                      size="sm"
                      variant="secondary"
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/35 p-3">
                <ToolMeta>Builder flow</ToolMeta>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  1) Pick a template, 2) adjust fields, 3) apply to parser for
                  final validation.
                </p>
              </div>

              <div>
                <ToolLabel>Quick Templates</ToolLabel>
                <div className="flex flex-wrap gap-1.5">
                  {builderTemplates.map((template) => (
                    <Button
                      key={template.name}
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleBuilderTemplate(template)}
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                  <ToolLabel className="mb-0">Time Cadence</ToolLabel>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <ToolbarGroup label="Minute">
                      <ToolbarSelect
                        value={builder.minute}
                        onChange={(value) =>
                          setBuilder((current) => ({
                            ...current,
                            minute: value,
                          }))
                        }
                        options={minuteBuilderOptions}
                        ariaLabel="Cron builder minute"
                        className="min-w-[170px]"
                      />
                    </ToolbarGroup>

                    <ToolbarGroup label="Hour">
                      <ToolbarSelect
                        value={builder.hour}
                        onChange={(value) =>
                          setBuilder((current) => ({ ...current, hour: value }))
                        }
                        options={hourBuilderOptions}
                        ariaLabel="Cron builder hour"
                        className="min-w-[170px]"
                      />
                    </ToolbarGroup>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border border-border bg-background p-3">
                  <ToolLabel className="mb-0">Calendar Filters</ToolLabel>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <ToolbarGroup label="Day (month)">
                      <ToolbarSelect
                        value={builder.dayOfMonth}
                        onChange={(value) =>
                          setBuilder((current) => ({
                            ...current,
                            dayOfMonth: value,
                          }))
                        }
                        options={dayOfMonthBuilderOptions}
                        ariaLabel="Cron builder day of month"
                        className="min-w-[170px]"
                      />
                    </ToolbarGroup>

                    <ToolbarGroup label="Month">
                      <ToolbarSelect
                        value={builder.month}
                        onChange={(value) =>
                          setBuilder((current) => ({
                            ...current,
                            month: value,
                          }))
                        }
                        options={monthBuilderOptions}
                        ariaLabel="Cron builder month"
                        className="min-w-[170px]"
                      />
                    </ToolbarGroup>

                    <ToolbarGroup label="Day (week)">
                      <ToolbarSelect
                        value={builder.dayOfWeek}
                        onChange={(value) =>
                          setBuilder((current) => ({
                            ...current,
                            dayOfWeek: value,
                          }))
                        }
                        options={dayOfWeekBuilderOptions}
                        ariaLabel="Cron builder day of week"
                        className="min-w-[170px] sm:col-span-2"
                      />
                    </ToolbarGroup>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <ToolLabel className="mb-0">Builder Expression</ToolLabel>
                  <Button type="button" size="sm" onClick={handleBuilderApply}>
                    Apply to parser
                  </Button>
                </div>
                <code className="block rounded-md border border-border bg-background px-2 py-2 font-mono text-[13px] text-foreground">
                  {builderExpression}
                </code>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Use parser mode to inspect field breakdown and test presets.
                </p>
              </div>
            </div>
          )}
        </ToolBody>

        {viewMode === "parser" && result.description && (
          <div className="border-t border-border">
            <div className="px-4 py-4">
              <ToolLabel>Description</ToolLabel>
              <p className="text-[15px] font-medium text-foreground">
                {result.description}
              </p>
            </div>
          </div>
        )}

        {viewMode === "parser" && mounted && result.nextRuns.length > 0 ? (
          <div className="border-t border-border">
            <div className="px-4 py-3">
              <ToolMeta>Next {result.nextRuns.length} runs</ToolMeta>
            </div>
            <div className="divide-y divide-border">
              {result.nextRuns.map((date, i) => (
                <div
                  key={`run-${date.getTime()}`}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="w-6 flex-shrink-0 text-right font-medium text-[11px] tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <code className="font-mono text-[13px] text-foreground">
                    {formatDate(date)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {viewMode === "builder" && builderResult.description && (
          <div className="border-t border-border">
            <div className="px-4 py-4">
              <ToolLabel>Builder Preview</ToolLabel>
              <p className="text-[15px] font-medium text-foreground">
                {builderResult.description}
              </p>
            </div>
          </div>
        )}

        {viewMode === "builder" &&
        mounted &&
        builderResult.nextRuns.length > 0 ? (
          <div className="border-t border-border">
            <div className="px-4 py-3">
              <ToolMeta>Next {builderResult.nextRuns.length} runs</ToolMeta>
            </div>
            <div className="divide-y divide-border">
              {builderResult.nextRuns.map((date, i) => (
                <div
                  key={`builder-run-${date.getTime()}`}
                  className="flex items-center gap-3 px-4 py-2.5"
                >
                  <span className="w-6 flex-shrink-0 text-right font-medium text-[11px] tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <code className="font-mono text-[13px] text-foreground">
                    {formatDate(date)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ) : (
          viewMode === "parser" &&
          !result.description &&
          !result.error && (
            <div className="border-t py-12 text-center border-border">
              <div className="tool-empty-icon">
                <FontAwesomeIcon
                  icon={faClock}
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[13px] text-muted-foreground">
                Enter a cron expression to parse it
              </p>
            </div>
          )
        )}
      </ToolCard>

      <ToolFootnote>
        Supports standard 5-field cron syntax with ranges, lists, steps, and
        wildcards. All processing happens locally in your browser.
      </ToolFootnote>
    </ToolPage>
  );
}
