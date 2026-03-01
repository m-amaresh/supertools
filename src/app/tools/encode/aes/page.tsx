"use client";

import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
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
  ToolOptionsBar,
  ToolPage,
  ToolStatusStack,
  ToolToolbar,
} from "@/components/tool/ToolScaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClipboard } from "@/hooks/useClipboard";
import { useToolState } from "@/hooks/useToolState";
import {
  type AesTextEncoding,
  bytesToText,
  decryptPayloadAesGcm,
  encryptBytesAesGcm,
  parseAesPayload,
  serializeAesPayload,
  textToBytes,
} from "@/lib/aes";
import { MAX_INPUT_SIZE, TEXT_ENCODING_OPTIONS } from "@/lib/constants";

type Mode = "encrypt" | "decrypt";
type SourceMode = "text" | "file";

const iterationOptions = [
  { value: "150000", label: "150k" },
  { value: "250000", label: "250k (Recommended)" },
  { value: "500000", label: "500k" },
] as const;

const MAX_UPLOAD_BYTES = 32 * 1024 * 1024;
const MIN_PASSPHRASE_LENGTH = 12;

export default function AesGcmTool() {
  const { readText, pasteError } = useClipboard();
  const [{ input, output, error }, { setInput, setOutput, setError }] =
    useToolState();

  const [mode, setMode] = useState<Mode>("encrypt");
  const [sourceMode, setSourceMode] = useState<SourceMode>("text");
  const [passphrase, setPassphrase] = useState("");
  const [textEncoding, setTextEncoding] = useState<AesTextEncoding>("utf8");
  const [iterations, setIterations] = useState("250000");
  const [fileName, setFileName] = useState("");
  const [fileMime, setFileMime] = useState("");
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileReadProgress, setFileReadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("decrypted.bin");

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const effectiveInputLabel = useMemo(() => {
    if (mode === "encrypt") {
      return sourceMode === "text" ? "Plaintext Input" : "Input File";
    }

    return sourceMode === "text"
      ? "Encrypted Payload"
      : "Encrypted Payload File";
  }, [mode, sourceMode]);

  const isEncryptFileMode = mode === "encrypt" && sourceMode === "file";
  const inputValue = isEncryptFileMode
    ? fileName
      ? `Loaded file: ${fileName}${fileBytes ? ` (${(fileBytes.byteLength / (1024 * 1024)).toFixed(2)} MB)` : ""}`
      : ""
    : input;

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setPassphrase("");
    setFileName("");
    setFileMime("");
    setFileBytes(null);
    setError(null);
    setSuccess(null);
    setIsReadingFile(false);
    setFileReadProgress(0);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
  }, [downloadUrl, setError, setInput, setOutput]);

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) {
      setSourceMode("text");
      setInput(text);
      setFileName("");
      setFileMime("");
      setFileBytes(null);
      setError(null);
      setSuccess(null);
    }
  }, [readText, setError, setInput]);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputElement = event.currentTarget;
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_UPLOAD_BYTES) {
        setError(
          `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Limit is ${MAX_UPLOAD_BYTES / (1024 * 1024)} MB.`,
        );
        inputElement.value = "";
        return;
      }

      setError(null);
      setSuccess(null);
      setSourceMode("file");
      setIsReadingFile(true);
      setFileReadProgress(0);
      setFileName(file.name);
      setFileMime(file.type || "application/octet-stream");
      setFileBytes(null);
      setInput("");

      try {
        if (mode === "encrypt") {
          const reader = file.stream().getReader();
          const chunks: Uint8Array[] = [];
          let loaded = 0;

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              loaded += value.byteLength;
              setFileReadProgress((loaded / file.size) * 100);
            }
          }

          const merged = new Uint8Array(loaded);
          let offset = 0;
          for (const chunk of chunks) {
            merged.set(chunk, offset);
            offset += chunk.byteLength;
          }
          // Release chunk references as soon as merge completes.
          chunks.length = 0;

          setFileBytes(merged);
          setSuccess(`Loaded file: ${file.name}`);
        } else {
          const text = await file.text();
          setInput(text);
          setFileReadProgress(100);
          setSuccess(`Loaded encrypted payload file: ${file.name}`);
        }
      } catch {
        setError("Failed to read file");
      } finally {
        setIsReadingFile(false);
        inputElement.value = "";
      }
    },
    [mode, setError, setInput],
  );

  const handleExecute = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setOutput("");

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    if (!passphrase) {
      setError("Passphrase is required");
      return;
    }

    if (passphrase.length < MIN_PASSPHRASE_LENGTH) {
      setError(
        `Passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters`,
      );
      return;
    }

    if (sourceMode === "text" && input.length > MAX_INPUT_SIZE) {
      setError("Input exceeds 1MB — switch to file mode for large content.");
      return;
    }

    setIsProcessing(true);

    try {
      if (mode === "encrypt") {
        const plaintextBytes =
          sourceMode === "file" ? fileBytes : textToBytes(input, textEncoding);

        if (!plaintextBytes) {
          setError(
            sourceMode === "file"
              ? "Upload a file to encrypt"
              : "Enter plaintext to encrypt",
          );
          return;
        }

        const payload = await encryptBytesAesGcm(plaintextBytes, passphrase, {
          iterations: Number.parseInt(iterations, 10),
          name: sourceMode === "file" ? fileName : undefined,
          type: sourceMode === "file" ? fileMime : undefined,
        });

        const armored = serializeAesPayload(payload);
        setOutput(armored);
        setSuccess("Encryption complete");
      } else {
        if (!input.trim()) {
          setError(
            sourceMode === "file"
              ? "Upload an encrypted payload file"
              : "Enter encrypted payload",
          );
          return;
        }

        const payload = parseAesPayload(input);
        const decrypted = await decryptPayloadAesGcm(payload, passphrase);

        if (payload.name) {
          const decryptedCopy = new Uint8Array(decrypted.byteLength);
          decryptedCopy.set(decrypted);
          const blob = new Blob([decryptedCopy.buffer as ArrayBuffer], {
            type: payload.type || "application/octet-stream",
          });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
          setDownloadName(payload.name);
          setOutput(`Decrypted ${decrypted.byteLength} bytes`);
          setSuccess("Decryption complete. File download is ready.");
        } else {
          setOutput(bytesToText(decrypted, textEncoding));
          setSuccess("Decryption complete");
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process");
    } finally {
      setIsProcessing(false);
    }
  }, [
    downloadUrl,
    fileBytes,
    fileMime,
    fileName,
    input,
    iterations,
    mode,
    passphrase,
    sourceMode,
    textEncoding,
    setError,
    setOutput,
  ]);

  return (
    <ToolPage>
      <ToolHeader
        title="AES-GCM Encrypt/Decrypt"
        description="Authenticated encryption with AES-256-GCM and PBKDF2 key derivation"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            <SegmentedControl
              value={mode}
              onChange={(value) => setMode(value as Mode)}
              ariaLabel="AES mode"
              options={[
                { value: "encrypt", label: "Encrypt" },
                { value: "decrypt", label: "Decrypt" },
              ]}
            />

            <SegmentedControl
              value={sourceMode}
              onChange={(value) => setSourceMode(value as SourceMode)}
              ariaLabel="AES source mode"
              options={[
                { value: "text", label: "Text" },
                { value: "file", label: "File" },
              ]}
            />

            <Button type="button" variant="default" onClick={handleExecute}>
              <FontAwesomeIcon
                icon={faPlay}
                className="h-3 w-3"
                aria-hidden="true"
              />
              {isProcessing
                ? "Working..."
                : mode === "encrypt"
                  ? "Encrypt"
                  : "Decrypt"}
            </Button>
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

            <Button asChild variant="ghost">
              <label htmlFor="aes-upload" className="cursor-pointer">
                <FontAwesomeIcon
                  icon={faUpload}
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                Upload
              </label>
            </Button>

            <input
              id="aes-upload"
              type="file"
              className="hidden"
              onChange={handleUpload}
            />

            {(input || output || fileBytes) && (
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
            label={mode === "encrypt" ? "Input Encoding" : "Output Encoding"}
          >
            <ToolbarSelect
              value={textEncoding}
              onChange={(value) => setTextEncoding(value as AesTextEncoding)}
              options={TEXT_ENCODING_OPTIONS}
              ariaLabel="AES text encoding"
            />
          </ToolbarGroup>

          <ToolbarGroup label="PBKDF2 Iterations">
            <ToolbarSelect
              value={iterations}
              onChange={setIterations}
              options={[...iterationOptions]}
              ariaLabel="PBKDF2 iteration count"
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
          {isReadingFile && (
            <AlertBox variant="warn">
              <span>
                Reading file {fileName}... {fileReadProgress.toFixed(0)}%
              </span>
            </AlertBox>
          )}

          {success && (
            <AlertBox variant="success">
              <span>{success}</span>
            </AlertBox>
          )}

          {error && (
            <AlertBox variant="error">
              <span>{error}</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody className="pt-0">
          <section>
            <ToolLabel htmlFor="aes-passphrase">Passphrase</ToolLabel>
            <Input
              id="aes-passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder={`Enter passphrase (min ${MIN_PASSPHRASE_LENGTH} chars)`}
              className="font-mono h-10"
              aria-label="AES passphrase"
              autoComplete="off"
              spellCheck={false}
            />
          </section>

          <section>
            <ToolLabel htmlFor="aes-input">{effectiveInputLabel}</ToolLabel>
            <Textarea
              id="aes-input"
              value={inputValue}
              onChange={(e) => {
                if (isEncryptFileMode) return;
                setInput(e.target.value);
                if (sourceMode === "file") {
                  setSourceMode("text");
                  setFileName("");
                  setFileMime("");
                  setFileBytes(null);
                }
              }}
              placeholder={
                sourceMode === "text"
                  ? mode === "encrypt"
                    ? "Enter plaintext to encrypt..."
                    : "Paste encrypted payload (st-aesgcm:...)..."
                  : mode === "encrypt"
                    ? "Use Upload to select a single file to encrypt"
                    : "Upload encrypted payload file or paste payload here"
              }
              rows={8}
              className="font-mono min-h-56"
              readOnly={isEncryptFileMode}
              spellCheck={false}
            />
          </section>
        </ToolBody>

        {output ? (
          <div className="border-t px-4 pb-4 pt-4 border-border">
            <div className="mb-2 flex items-center justify-between">
              <ToolMeta>
                {mode === "encrypt" ? "Encrypted Payload" : "Decrypted Output"}
              </ToolMeta>
              <CopyButton text={output} />
            </div>

            <Textarea
              readOnly
              value={output}
              rows={8}
              className="max-h-[32rem] font-mono min-h-56"
            />

            {downloadUrl && (
              <div className="mt-3">
                <Button asChild variant="secondary">
                  <a href={downloadUrl} download={downloadName}>
                    <FontAwesomeIcon
                      icon={faDownload}
                      className="h-3 w-3"
                      aria-hidden="true"
                    />
                    Download {downloadName}
                  </a>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-t border-border py-12 text-center">
            <div className="tool-empty-icon">
              <FontAwesomeIcon
                icon={faLock}
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            <p className="text-[13px] text-muted-foreground">
              Enter input, passphrase, and click{" "}
              {mode === "encrypt" ? "Encrypt" : "Decrypt"}
            </p>
          </div>
        )}
      </ToolCard>

      <ToolFootnote>
        Uses AES-256-GCM with random 96-bit IV and PBKDF2-SHA256 key derivation.
        Payload format is armored as <code>st-aesgcm:...</code>. All processing
        happens locally in your browser.
      </ToolFootnote>
    </ToolPage>
  );
}
