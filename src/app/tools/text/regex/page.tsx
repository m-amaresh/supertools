"use client";

import { faAsterisk } from "@fortawesome/free-solid-svg-icons/faAsterisk";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertBox } from "@/components/AlertBox";
import { CopyButton } from "@/components/CopyButton";
import { ToolbarCheckbox, ToolbarGroup } from "@/components/Toolbar";
import {
  ToolBody,
  ToolCard,
  ToolFootnote,
  ToolHeader,
  ToolLabel,
  ToolMeta,
  ToolOptionsBar,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/useClipboard";
import { MAX_INPUT_SIZE } from "@/lib/constants";
import { type RegexMatch, type RegexResult, regexPresets } from "@/lib/regex";

const REGEX_TIMEOUT_MS = 500;

export default function RegexTester() {
  const { readText, pasteError } = useClipboard();

  // NOTE: This tool does NOT use useToolState because:
  // 1. It has two separate inputs (pattern + testString) rather than single input/output
  // 2. Uses Web Worker for async computation with complex result structure
  // 3. Result contains both matches array and nested error - doesn't fit standard error pattern
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flagG, setFlagG] = useState(true);
  const [flagI, setFlagI] = useState(false);
  const [flagM, setFlagM] = useState(false);
  const [flagS, setFlagS] = useState(false);
  const [result, setResult] = useState<RegexResult>({
    matches: [],
    error: null,
  });

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("./regex.worker.ts", import.meta.url),
    );
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const flags = useMemo(() => {
    let f = "";
    if (flagG) f += "g";
    if (flagI) f += "i";
    if (flagM) f += "m";
    if (flagS) f += "s";
    return f;
  }, [flagG, flagI, flagM, flagS]);

  const oversized = testString.length > MAX_INPUT_SIZE;

  useEffect(() => {
    if (oversized || !pattern) {
      setResult({ matches: [], error: null });
      return;
    }

    const worker = workerRef.current;
    if (!worker) return;

    let cancelled = false;

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      worker.terminate();
      workerRef.current = new Worker(
        new URL("./regex.worker.ts", import.meta.url),
      );
      setResult({
        matches: [],
        error: `Regex execution timed out after ${REGEX_TIMEOUT_MS}ms`,
      });
    }, REGEX_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<RegexResult>) => {
      window.clearTimeout(timeoutId);
      if (!cancelled) {
        setResult(event.data);
      }
    };

    worker.onerror = () => {
      window.clearTimeout(timeoutId);
      if (!cancelled) {
        worker.terminate();
        workerRef.current = new Worker(
          new URL("./regex.worker.ts", import.meta.url),
        );
        setResult({
          matches: [],
          error: "Regex worker failed to execute",
        });
      }
    };

    worker.postMessage({ pattern, flags, testString });

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [flags, oversized, pattern, testString]);

  const handleClear = useCallback(() => {
    setPattern("");
    setTestString("");
  }, []);

  const handlePreset = useCallback((preset: (typeof regexPresets)[number]) => {
    setPattern(preset.pattern);
    setFlagG(preset.flags.includes("g"));
    setFlagI(preset.flags.includes("i"));
    setFlagM(preset.flags.includes("m"));
    setFlagS(preset.flags.includes("s"));
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) setTestString(text);
  }, [readText]);

  const highlightedHtml = useMemo(() => {
    if (
      !testString ||
      !pattern ||
      result.error ||
      result.matches.length === 0
    ) {
      return null;
    }

    const parts: { text: string; highlight: boolean; id: string }[] = [];
    let lastIndex = 0;

    const sortedMatches = [...result.matches].sort((a, b) => a.index - b.index);

    for (let i = 0; i < sortedMatches.length; i++) {
      const match = sortedMatches[i];
      if (match.index > lastIndex) {
        parts.push({
          text: testString.slice(lastIndex, match.index),
          highlight: false,
          id: `t-${lastIndex}-${match.index}`,
        });
      }
      if (match.index >= lastIndex) {
        parts.push({
          text: match.fullMatch,
          highlight: true,
          id: `m-${match.index}-${match.length}`,
        });
        lastIndex = match.index + match.length;
      }
    }

    if (lastIndex < testString.length) {
      parts.push({
        text: testString.slice(lastIndex),
        highlight: false,
        id: `t-${lastIndex}-end`,
      });
    }

    return parts;
  }, [testString, pattern, result]);

  const matchesText = result.matches
    .map((m, i) => `Match ${i + 1}: "${m.fullMatch}" at index ${m.index}`)
    .join("\n");

  const activePreset = useMemo(
    () =>
      regexPresets.find(
        (preset) => preset.pattern === pattern && preset.flags === flags,
      )?.name ?? null,
    [pattern, flags],
  );

  return (
    <ToolPage>
      <ToolHeader
        title="Regex Tester"
        description="Test regular expressions with live matching and capture groups"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            {result.matches.length > 0 && <CopyButton text={matchesText} />}
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
            {(pattern || testString) && (
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

        <ToolOptionsBar>
          <ToolbarGroup label="Flags">
            <div className="flex items-center gap-4">
              <ToolbarCheckbox
                checked={flagG}
                onChange={setFlagG}
                label="Global (g)"
              />
              <ToolbarCheckbox
                checked={flagI}
                onChange={setFlagI}
                label="Case insensitive (i)"
              />
              <ToolbarCheckbox
                checked={flagM}
                onChange={setFlagM}
                label="Multiline (m)"
              />
              <ToolbarCheckbox
                checked={flagS}
                onChange={setFlagS}
                label="Dotall (s)"
              />
            </div>
          </ToolbarGroup>
        </ToolOptionsBar>

        <ToolStatusStack>
          {pasteError && (
            <AlertBox variant="error">
              <span>
                Clipboard access denied — use Ctrl+V / Cmd+V to paste directly.
              </span>
            </AlertBox>
          )}
          {oversized && (
            <AlertBox variant="warn">
              <span>
                Input exceeds 1MB — matching disabled to prevent UI freezing.
              </span>
            </AlertBox>
          )}
          {result.error && (
            <AlertBox variant="error">
              <span className="font-mono">{result.error}</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody className="pt-0">
          <div>
            <ToolLabel htmlFor="regex-pattern">Pattern</ToolLabel>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[15px] text-muted-foreground">
                /
              </span>
              <Input
                id="regex-pattern"
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                aria-label="Regex pattern"
                className="h-9 flex-1 text-[13px] font-mono"
                spellCheck={false}
              />
              <span className="font-mono text-[15px] text-muted-foreground">
                /{flags}
              </span>
            </div>
          </div>

          <div>
            <ToolLabel>Common Patterns</ToolLabel>
            <div className="flex flex-wrap gap-1.5">
              {regexPresets.map((preset) => {
                const isActive = activePreset === preset.name;

                return (
                  <Button
                    key={preset.name}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className={isActive ? "ring-1 ring-ring" : undefined}
                    onClick={() => handlePreset(preset)}
                    title={preset.description}
                    aria-pressed={isActive}
                  >
                    {preset.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <ToolLabel htmlFor="regex-test-string">Test String</ToolLabel>
            <Textarea
              id="regex-test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against..."
              rows={8}
              aria-label="Test string"
              className="font-mono min-h-56"
              spellCheck={false}
            />
          </div>

          {highlightedHtml && (
            <div>
              <ToolLabel>Highlighted Matches</ToolLabel>
              <div className="bg-muted/40 whitespace-pre-wrap break-all rounded-md border border-border p-3 font-mono text-[13px] leading-relaxed">
                {highlightedHtml.map((part) =>
                  part.highlight ? (
                    <mark
                      key={part.id}
                      className="bg-accent text-accent-foreground rounded-sm px-0.5"
                    >
                      {part.text}
                    </mark>
                  ) : (
                    <span key={part.id} className="text-foreground">
                      {part.text}
                    </span>
                  ),
                )}
              </div>
            </div>
          )}
        </ToolBody>

        {result.matches.length > 0 ? (
          <div className="border-t border-border">
            <div className="px-4 py-3">
              <ToolMeta>
                {result.matches.length} match
                {result.matches.length > 1 ? "es" : ""} found
              </ToolMeta>
            </div>
            <div className="max-h-64 divide-y divide-border overflow-y-auto">
              {result.matches.map((match: RegexMatch, i: number) => (
                <div key={`m-${match.index}-${i}`} className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className="w-6 flex-shrink-0 text-right text-[11px] font-medium tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <code className="flex-1 break-all font-mono text-[13px] text-foreground">
                      {match.fullMatch}
                    </code>
                    <span className="flex-shrink-0 text-[11px] tabular-nums text-muted-foreground">
                      idx {match.index}
                    </span>
                    <CopyButton text={match.fullMatch} />
                  </div>

                  {match.groups.length > 0 && (
                    <div className="ml-9 mt-1.5 flex flex-wrap gap-1.5">
                      {match.groups.map((group: string, gi: number) => (
                        <span
                          key={`g-${match.index}-${gi}`}
                          className="inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px]"
                        >
                          <span className="text-muted-foreground">
                            ${gi + 1}
                          </span>
                          <span className="text-foreground">{group}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {Object.keys(match.namedGroups).length > 0 && (
                    <div className="ml-9 mt-1.5 flex flex-wrap gap-1.5">
                      {Object.entries(match.namedGroups).map(
                        ([name, value]) => (
                          <span
                            key={`ng-${match.index}-${name}`}
                            className="inline-flex items-center gap-1 rounded border border-border bg-accent px-2 py-0.5 font-mono text-[11px]"
                          >
                            <span className="text-muted-foreground">
                              {name}
                            </span>
                            <span className="text-accent-foreground">
                              {value}
                            </span>
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          pattern &&
          testString &&
          !result.error && (
            <div className="border-t border-border py-8 text-center">
              <p className="text-[13px] text-muted-foreground">
                No matches found
              </p>
            </div>
          )
        )}

        {!pattern && !testString && (
          <div className="border-t border-border py-12 text-center">
            <div className="tool-empty-icon">
              <FontAwesomeIcon
                icon={faAsterisk}
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-[13px] text-muted-foreground">
              Enter a pattern and test string to start matching
            </p>
          </div>
        )}
      </ToolCard>

      <ToolFootnote>
        Uses the JavaScript <code>RegExp</code> engine. All processing happens
        locally in your browser.
      </ToolFootnote>
    </ToolPage>
  );
}
