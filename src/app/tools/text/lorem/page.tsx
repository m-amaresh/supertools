"use client";

import { faAlignLeft } from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useState } from "react";
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
  ToolMeta,
  ToolOptionsBar,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateLorem, type LoremUnit } from "@/lib/lorem";
import { parseStrictPositiveInt } from "@/lib/utils";

const unitOptions = [
  { value: "paragraphs", label: "Paragraphs" },
  { value: "sentences", label: "Sentences" },
  { value: "words", label: "Words" },
];

const countOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "custom", label: "Custom…" },
];

const MIN_LOREM_COUNT = 1;
const MAX_LOREM_COUNT = 100;

export default function LoremIpsumGenerator() {
  const [output, setOutput] = useState("");
  const [countMode, setCountMode] = useState("3");
  const [customCount, setCustomCount] = useState("3");
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);

  const countInput = countMode === "custom" ? customCount : countMode;
  const parsedCustomCount = parseStrictPositiveInt(countInput);
  const countError =
    parsedCustomCount === null
      ? "Count must be a whole number."
      : parsedCustomCount < MIN_LOREM_COUNT ||
          parsedCustomCount > MAX_LOREM_COUNT
        ? `Count must be between ${MIN_LOREM_COUNT} and ${MAX_LOREM_COUNT}.`
        : null;

  const generate = useCallback(() => {
    if (parsedCustomCount === null || countError) return;
    const result = generateLorem(parsedCustomCount, unit, startWithLorem);
    setOutput(result);
  }, [countError, parsedCustomCount, startWithLorem, unit]);

  const clear = useCallback(() => {
    setOutput("");
  }, []);

  const wordCount = output ? output.split(/\s+/).filter(Boolean).length : 0;
  const charCount = output.length;

  return (
    <ToolPage>
      <ToolHeader
        title="Lorem Ipsum Generator"
        description="Generate placeholder text for designs and layouts"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              onClick={generate}
              disabled={Boolean(countError)}
            >
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className="h-3 w-3"
                aria-hidden="true"
              />
              Generate
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {output && (
              <span className="tabular-nums text-[12px] text-muted-foreground">
                {wordCount} words, {charCount} chars
              </span>
            )}
            {output && (
              <Button type="button" variant="ghost" onClick={clear}>
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
          <ToolbarGroup label="Count">
            <ToolbarSelect
              value={countMode}
              onChange={(value) => {
                setCountMode(value);
                if (value !== "custom") {
                  setCustomCount(value);
                }
              }}
              options={countOptions}
              ariaLabel="Lorem count"
            />
          </ToolbarGroup>
          {countMode === "custom" && (
            <ToolbarGroup label="Custom">
              <Input
                type="text"
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                aria-label="Custom lorem count"
                className="h-8 w-20 text-[13px] font-mono"
                inputMode="numeric"
                spellCheck={false}
              />
            </ToolbarGroup>
          )}

          <ToolbarGroup label="Unit">
            <ToolbarSelect
              value={unit}
              onChange={(v) => setUnit(v as LoremUnit)}
              options={unitOptions}
              ariaLabel="Lorem unit"
            />
          </ToolbarGroup>

          <ToolbarCheckbox
            checked={startWithLorem}
            onChange={setStartWithLorem}
            label='Start with "Lorem ipsum..."'
          />
        </ToolOptionsBar>

        <ToolStatusStack>
          {countError && (
            <AlertBox variant="error">
              <span>{countError}</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody className="pt-0">
          {output ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <ToolMeta>Generated Text</ToolMeta>
                <CopyButton text={output} />
              </div>
              <Textarea
                readOnly
                value={output}
                rows={Math.min(16, output.split("\n").length + 2)}
                aria-label="Generated lorem ipsum text"
                className="max-h-[32rem] font-mono min-h-56"
              />
            </section>
          ) : (
            <div className="py-12 text-center">
              <div className="tool-empty-icon">
                <FontAwesomeIcon
                  icon={faAlignLeft}
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[13px] text-muted-foreground">
                Click Generate to create placeholder text
              </p>
            </div>
          )}
        </ToolBody>
      </ToolCard>

      <ToolFootnote>
        Generates classic Lorem Ipsum text. All processing happens locally in
        your browser.
      </ToolFootnote>
    </ToolPage>
  );
}
