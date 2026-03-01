"use client";

import { faFont } from "@fortawesome/free-solid-svg-icons/faFont";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertBox } from "@/components/AlertBox";
import { CopyButton } from "@/components/CopyButton";
import {
  ToolBody,
  ToolCard,
  ToolFootnote,
  ToolHeader,
  ToolLabel,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/useClipboard";
import { useToolState } from "@/hooks/useToolState";
import { type CaseType, caseOptions, convertCaseMultiline } from "@/lib/case";
import { MAX_INPUT_SIZE } from "@/lib/constants";

export default function CaseConverter() {
  const { readText, pasteError } = useClipboard();
  const [{ input, output }, { setInput, setOutput, handleClear }] =
    useToolState();

  const [activeCase, setActiveCase] = useState<CaseType>("camel");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedInput(input);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input]);

  const allConversions = useMemo(() => {
    if (!debouncedInput.trim()) return null;
    if (debouncedInput.length > MAX_INPUT_SIZE) return null;
    const result = {} as Record<CaseType, string>;
    for (const opt of caseOptions) {
      result[opt.value] = convertCaseMultiline(debouncedInput, opt.value);
    }
    return result;
  }, [debouncedInput]);

  useEffect(() => {
    if (!allConversions) {
      setOutput("");
      return;
    }
    setOutput(allConversions[activeCase]);
  }, [activeCase, allConversions, setOutput]);

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) setInput(text);
  }, [readText, setInput]);

  return (
    <ToolPage>
      <ToolHeader
        title="Case Converter"
        description="Convert text between camelCase, snake_case, and other formats"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
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
                Input exceeds 1MB — conversion disabled to prevent UI freezing.
              </span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody className="pt-0">
          <ToolLabel htmlFor="case-input">Input Text</ToolLabel>
          <Textarea
            id="case-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            rows={4}
            aria-label="Input text"
            className="font-mono min-h-40"
            spellCheck={false}
          />
        </ToolBody>

        {input.trim() ? (
          <div className="border-t border-border">
            <div className="divide-y divide-border">
              {caseOptions.map((opt) => {
                const converted = allConversions?.[opt.value] ?? "";
                const isActive = activeCase === opt.value;

                return (
                  <div
                    key={opt.value}
                    className={`flex w-full items-center gap-4 px-4 py-3 transition-all duration-150 ${
                      isActive ? "bg-muted/40" : "hover:bg-muted"
                    }`}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`w-32 flex-shrink-0 justify-start px-2 ${
                        isActive
                          ? "text-foreground hover:text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setActiveCase(opt.value)}
                      aria-pressed={isActive}
                    >
                      {opt.label}
                    </Button>
                    <code className="flex-1 truncate font-mono text-[13px] text-foreground">
                      {converted}
                    </code>
                    <CopyButton text={converted} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="border-t py-12 text-center border-border">
            <div className="tool-empty-icon">
              <FontAwesomeIcon
                icon={faFont}
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-[13px] text-muted-foreground">
              Enter text above to see all case conversions
            </p>
          </div>
        )}
      </ToolCard>

      <ToolFootnote>
        All processing happens locally in your browser. No data is sent to any
        server.
      </ToolFootnote>
    </ToolPage>
  );
}
