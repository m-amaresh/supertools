"use client";

import { faCode } from "@fortawesome/free-solid-svg-icons/faCode";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons/faRightLeft";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useRef, useState } from "react";
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
  ToolOptionsBar,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/useClipboard";
import { useToolState } from "@/hooks/useToolState";
import {
  type Base64TextEncoding,
  type Base64Variant,
  decodeBase64,
  encodeBase64,
  fileToBase64,
  isValidBase64,
} from "@/lib/base64";
import { MAX_INPUT_SIZE, TEXT_ENCODING_OPTIONS } from "@/lib/constants";

type Mode = "encode" | "decode";

const variantOptions = [
  { value: "standard", label: "Standard" },
  { value: "url", label: "URL-safe" },
] as const;

const MAX_UPLOAD_BYTES = 16 * 1024 * 1024;

export default function Base64Tool() {
  const { readText, pasteError } = useClipboard();
  const [
    { input, output, error },
    { setInput, setOutput, setError, handleClear },
  ] = useToolState();

  const [mode, setMode] = useState<Mode>("encode");
  const [textEncoding, setTextEncoding] = useState<Base64TextEncoding>("utf8");
  const [variant, setVariant] = useState<Base64Variant>("standard");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processInput = useCallback(
    (
      text: string,
      currentMode: Mode,
      currentEncoding: Base64TextEncoding,
      currentVariant: Base64Variant,
    ) => {
      setInput(text);
      setError(null);
      setOutput("");

      if (!text.trim()) return;

      if (text.length > MAX_INPUT_SIZE) {
        setError(
          "Input exceeds 1MB — processing disabled to prevent UI freezing.",
        );
        return;
      }

      try {
        if (currentMode === "encode") {
          setOutput(
            encodeBase64(text, {
              inputEncoding: currentEncoding,
              variant: currentVariant,
            }),
          );
        } else {
          const compact = text.replace(/\s/g, "");
          if (!isValidBase64(compact, currentVariant)) {
            setError("Invalid Base64 string");
            return;
          }
          setOutput(
            decodeBase64(compact, {
              outputEncoding: currentEncoding,
              variant: currentVariant,
            }),
          );
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Processing failed");
      }
    },
    [setError, setInput, setOutput],
  );

  const handleInputChange = useCallback(
    (text: string) => {
      processInput(text, mode, textEncoding, variant);
    },
    [mode, processInput, textEncoding, variant],
  );

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      setOutput("");
      setError(null);
      if (input.trim()) {
        processInput(input, newMode, textEncoding, variant);
      }
    },
    [input, processInput, textEncoding, variant, setError, setOutput],
  );

  const handleSwap = useCallback(() => {
    if (!output) return;

    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    processInput(output, newMode, textEncoding, variant);
  }, [mode, output, processInput, textEncoding, variant, setInput]);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_UPLOAD_BYTES) {
        setError(
          `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Limit is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB to keep the browser responsive.`,
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setMode("encode");
        setInput("");
        setOutput(base64);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to read file");
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [setError, setInput, setOutput],
  );

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) processInput(text, mode, textEncoding, variant);
  }, [readText, mode, processInput, textEncoding, variant]);

  const handleEncodingChange = useCallback(
    (value: string) => {
      const nextEncoding = value as Base64TextEncoding;
      setTextEncoding(nextEncoding);
      if (input.trim()) {
        processInput(input, mode, nextEncoding, variant);
      }
    },
    [input, mode, processInput, variant],
  );

  const handleVariantChange = useCallback(
    (value: string) => {
      const nextVariant = value as Base64Variant;
      setVariant(nextVariant);
      if (input.trim()) {
        processInput(input, mode, textEncoding, nextVariant);
      }
    },
    [input, mode, processInput, textEncoding],
  );

  return (
    <ToolPage>
      <ToolHeader
        title="Base64 Encoder/Decoder"
        description="Convert text to Base64 and back"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            <SegmentedControl
              value={mode}
              onChange={handleModeChange}
              ariaLabel="Base64 mode"
              options={[
                { value: "encode", label: "Encode" },
                { value: "decode", label: "Decode" },
              ]}
            />

            {output && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleSwap}
                title="Swap input and output"
                aria-label="Swap input and output"
              >
                <FontAwesomeIcon
                  icon={faRightLeft}
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                Swap
              </Button>
            )}
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

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="base64-file-input"
            />

            <Button asChild variant="ghost">
              <label htmlFor="base64-file-input" className="cursor-pointer">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                Upload
              </label>
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
          <ToolbarGroup
            label={mode === "encode" ? "Input Encoding" : "Output Encoding"}
          >
            <ToolbarSelect
              value={textEncoding}
              onChange={handleEncodingChange}
              options={TEXT_ENCODING_OPTIONS}
              ariaLabel={
                mode === "encode"
                  ? "Input text encoding"
                  : "Decoded output encoding"
              }
            />
          </ToolbarGroup>

          <ToolbarGroup label="Base64 Variant">
            <ToolbarSelect
              value={variant}
              onChange={handleVariantChange}
              options={[...variantOptions]}
              ariaLabel="Base64 alphabet variant"
            />
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
          {(input.length > MAX_INPUT_SIZE ||
            output.length > MAX_INPUT_SIZE) && (
            <AlertBox variant="warn">
              <span>
                Large data detected — copying or further processing may be slow.
              </span>
            </AlertBox>
          )}

          {error && (
            <AlertBox variant="error">
              <span>{error}</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody>
          <section>
            <ToolLabel htmlFor="base64-input">
              {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
            </ToolLabel>
            <Textarea
              id="base64-input"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 string to decode..."
              }
              rows={8}
              aria-label={
                mode === "encode" ? "Text to encode" : "Base64 to decode"
              }
              spellCheck={false}
              className="font-mono min-h-56"
            />
          </section>

          {output ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <ToolMeta>
                  {mode === "encode" ? "Base64 Output" : "Decoded Text"}
                </ToolMeta>
                <CopyButton text={output} />
              </div>
              <Textarea
                readOnly
                value={output}
                rows={8}
                aria-label={
                  mode === "encode" ? "Base64 output" : "Decoded text"
                }
                className="max-h-[32rem] font-mono min-h-56"
              />
            </section>
          ) : (
            <section>
              <div className="border-t border-border py-12 text-center">
                <div className="tool-empty-icon">
                  <FontAwesomeIcon
                    icon={faCode}
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[13px] text-muted-foreground">
                  Enter text to {mode === "encode" ? "encode" : "decode"}
                </p>
              </div>
            </section>
          )}
        </ToolBody>
      </ToolCard>

      <ToolFootnote>
        Supports UTF-8, Latin-1, and Hex text encoding with standard or URL-safe
        Base64 variant. All processing happens locally in your browser.
      </ToolFootnote>
    </ToolPage>
  );
}
