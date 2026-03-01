"use client";

import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
import { faDownLeftAndUpRightToCenter } from "@fortawesome/free-solid-svg-icons/faDownLeftAndUpRightToCenter";
import { faFileCode } from "@fortawesome/free-solid-svg-icons/faFileCode";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faTurnDown } from "@fortawesome/free-solid-svg-icons/faTurnDown";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertBox } from "@/components/AlertBox";
import { CopyButton } from "@/components/CopyButton";
import {
  ToolbarCheckbox,
  ToolbarGroup,
  ToolbarSelect,
} from "@/components/Toolbar";
import {
  ToolBody,
  ToolCard,
  ToolFootnote,
  ToolHeader,
  ToolLabel,
  ToolOptionsBar,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/useClipboard";
import { useToolState } from "@/hooks/useToolState";
import { MAX_INPUT_SIZE } from "@/lib/constants";
import { sortJsonKeys, validateJson } from "@/lib/json";

const indentOptions = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tab" },
];

export default function JsonFormatter() {
  const { readText, pasteError } = useClipboard();
  const [{ input, output }, { setInput, setOutput, handleClear }] =
    useToolState();

  const [indent, setIndent] = useState("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState<{
    message: string;
    line?: number;
    column?: number;
  } | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processJson = useCallback(
    (text: string, indentVal: string, shouldSort: boolean) => {
      setError(null);
      setOutput("");

      if (!text.trim()) return;

      const validation = validateJson(text);
      if (!validation.valid && validation.error) {
        setError(validation.error);
        return;
      }

      const indentNum =
        indentVal === "tab" ? "\t" : Number.parseInt(indentVal, 10);
      const parsed = validation.parsed;
      const result = shouldSort
        ? JSON.stringify(sortJsonKeys(parsed), null, indentNum)
        : JSON.stringify(parsed, null, indentNum);
      setOutput(result);
    },
    [setOutput],
  );

  useEffect(() => {
    if (input.length > MAX_INPUT_SIZE) {
      setOutput("");
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      processJson(input, indent, sortKeys);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [indent, input, processJson, sortKeys, setOutput]);

  const handleFormat = useCallback(() => {
    if (input.length > MAX_INPUT_SIZE) return;
    processJson(input, indent, sortKeys);
  }, [indent, input, processJson, sortKeys]);

  const handleMinify = useCallback(() => {
    setError(null);
    setOutput("");

    if (!input.trim()) return;
    if (input.length > MAX_INPUT_SIZE) return;

    const validation = validateJson(input);
    if (!validation.valid && validation.error) {
      setError(validation.error);
      return;
    }

    setOutput(JSON.stringify(validation.parsed));
  }, [input, setOutput]);

  const handleUseOutput = useCallback(() => {
    if (output) setInput(output);
  }, [output, setInput]);

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) setInput(text);
  }, [readText, setInput]);

  return (
    <ToolPage>
      <ToolHeader
        title="JSON Formatter"
        description="Validate, format, and minify JSON with error highlighting"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            <Button type="button" variant="default" onClick={handleFormat}>
              <FontAwesomeIcon
                icon={faCode}
                className="h-3 w-3"
                aria-hidden="true"
              />
              Format
            </Button>
            <Button type="button" variant="secondary" onClick={handleMinify}>
              <FontAwesomeIcon
                icon={faDownLeftAndUpRightToCenter}
                className="h-3 w-3"
                aria-hidden="true"
              />
              Minify
            </Button>
            {output && <CopyButton text={output} />}
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
            {(input || output) && (
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
          <ToolbarGroup label="Indent">
            <ToolbarSelect
              value={indent}
              onChange={setIndent}
              options={indentOptions}
              ariaLabel="JSON indentation"
            />
          </ToolbarGroup>

          <ToolbarCheckbox
            checked={sortKeys}
            onChange={setSortKeys}
            label="Sort keys"
          />
        </ToolOptionsBar>

        <ToolStatusStack>
          {pasteError && (
            <AlertBox variant="error">
              <span>
                Clipboard access denied — use Ctrl+V / Cmd+V to paste directly.
              </span>
            </AlertBox>
          )}
          {input.length > MAX_INPUT_SIZE && (
            <AlertBox variant="warn">
              <span>
                Large input — auto-processing disabled. Click Format or Minify
                to process.
              </span>
            </AlertBox>
          )}

          {error && (
            <AlertBox variant="error">
              <span className="font-medium">
                Invalid JSON
                {error.line && error.column
                  ? ` at line ${error.line}, column ${error.column}`
                  : ""}
              </span>
              <span className="mt-0.5 text-[12px] opacity-90">
                {error.message}
              </span>
            </AlertBox>
          )}

          {input.trim() && !error && (
            <AlertBox variant="success">
              <span>Valid JSON</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody className="grid divide-y divide-border p-0 md:grid-cols-2 md:divide-x md:divide-y-0">
          <section className="p-4">
            <div className="mb-2 flex min-h-8 items-center">
              <ToolLabel htmlFor="json-input" className="mb-0">
                Input JSON
              </ToolLabel>
            </div>
            <Textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              rows={12}
              aria-label="Input JSON"
              className={`font-mono min-h-72 ${error ? "border-destructive" : ""}`}
              spellCheck={false}
            />
          </section>

          <section className="p-4">
            <div className="mb-2 flex min-h-8 items-center justify-between">
              <ToolLabel htmlFor="json-output" className="mb-0">
                Output
              </ToolLabel>
              {output && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUseOutput}
                >
                  <FontAwesomeIcon
                    icon={faTurnDown}
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                  Use as input
                </Button>
              )}
            </div>

            <div className="relative">
              <Textarea
                id="json-output"
                readOnly
                value={output}
                rows={12}
                aria-label="Formatted output"
                className="field-sizing-content font-mono min-h-72"
                placeholder="Formatted output will appear here..."
              />
              {!output && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md border border-border bg-background/70">
                  <div className="text-center">
                    <div className="tool-empty-icon mx-auto">
                      <FontAwesomeIcon
                        icon={faFileCode}
                        className="h-5 w-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-[13px] text-muted-foreground">
                      Enter JSON and click Format or Minify
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </ToolBody>
      </ToolCard>

      <ToolFootnote>
        All processing happens locally in your browser. No data is sent to any
        server.
      </ToolFootnote>
    </ToolPage>
  );
}
