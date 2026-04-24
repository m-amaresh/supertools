"use client";

import { faNetworkWired } from "@fortawesome/free-solid-svg-icons/faNetworkWired";
import { faPaste } from "@fortawesome/free-solid-svg-icons/faPaste";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo, useState } from "react";
import { AlertBox } from "@/components/AlertBox";
import { CopyButton } from "@/components/CopyButton";
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
import { type CidrInfo, parseCidr } from "@/lib/cidr";

const presets = [
  { label: "10.0.0.0/8", value: "10.0.0.0/8" },
  { label: "172.16.0.0/12", value: "172.16.0.0/12" },
  { label: "192.168.1.0/24", value: "192.168.1.0/24" },
  { label: "100.64.0.0/10", value: "100.64.0.0/10" },
  { label: "2001:db8::/32", value: "2001:db8::/32" },
  { label: "fe80::/10", value: "fe80::/10" },
];

export default function CidrCalculator() {
  const { readText, pasteError } = useClipboard();
  const [input, setInput] = useState("");

  const result = useMemo(() => parseCidr(input), [input]);
  const info = result.info;

  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text !== null) setInput(text.trim());
  }, [readText]);

  const copyAll = info ? formatInfoForCopy(info) : "";

  return (
    <ToolPage>
      <ToolHeader
        title="CIDR / Subnet Calculator"
        description="Compute IPv4 and IPv6 network ranges, masks, and host counts"
      />

      <ToolCard>
        <ToolToolbar>
          <div className="flex items-center gap-2">
            {info && <CopyButton text={copyAll} />}
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => setInput("")}
              >
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
          {result.error && (
            <AlertBox variant="error">
              <span>{result.error}</span>
            </AlertBox>
          )}
        </ToolStatusStack>

        <ToolBody className="pt-4">
          <section>
            <ToolLabel htmlFor="cidr-input">CIDR or IP Address</ToolLabel>
            <Input
              id="cidr-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="192.168.1.0/24 or 2001:db8::/32"
              aria-label="CIDR or IP address input"
              className="h-10 text-[14px] font-mono"
              spellCheck={false}
              autoComplete="off"
            />
          </section>

          <section>
            <ToolLabel>Common Ranges</ToolLabel>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const isActive = input.trim() === preset.value;
                return (
                  <Button
                    key={preset.value}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className={isActive ? "ring-1 ring-ring" : undefined}
                    onClick={() => setInput(preset.value)}
                    aria-pressed={isActive}
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
          </section>
        </ToolBody>

        {info ? (
          <div className="border-t border-border">
            <div className="flex items-center justify-between px-4 py-3">
              <ToolMeta>
                IPv{info.version} · /{info.prefix}
                {info.ipClass ? ` · Class ${info.ipClass}` : ""}
              </ToolMeta>
              <FlagList info={info} />
            </div>

            <div className="divide-y divide-border border-t border-border">
              <InfoRow label="Network" value={info.network} />
              {info.broadcast && (
                <InfoRow label="Broadcast" value={info.broadcast} />
              )}
              {info.firstHost && (
                <InfoRow label="First Host" value={info.firstHost} />
              )}
              {info.lastHost && (
                <InfoRow label="Last Host" value={info.lastHost} />
              )}
              <InfoRow
                label="Range"
                value={`${info.rangeStart} – ${info.rangeEnd}`}
              />
              <InfoRow label="Netmask" value={info.netmask} />
              {info.wildcard && (
                <InfoRow label="Wildcard" value={info.wildcard} />
              )}
              <InfoRow label="Total addresses" value={info.totalHostCount} />
              <InfoRow label="Usable hosts" value={info.usableHostCount} />
              <InfoRow label="Hex network" value={info.hexNetwork} mono />
              <InfoRow label="Binary network" value={info.binaryNetwork} mono />
            </div>
          </div>
        ) : (
          !result.error && (
            <div className="border-t border-border py-12 text-center">
              <div className="inline-flex items-center justify-center size-10 mb-3 rounded-lg bg-foreground/[0.07]">
                <FontAwesomeIcon
                  icon={faNetworkWired}
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="text-[13px] text-muted-foreground">
                Enter a CIDR expression or IP address to see subnet details
              </p>
            </div>
          )
        )}
      </ToolCard>

      <ToolFootnote>
        Uses <code className="font-mono">BigInt</code> math for IPv4 (/0–/32)
        and IPv6 (/0–/128). A bare IP without a prefix is treated as /32 or
        /128. All processing happens locally in your browser.
      </ToolFootnote>
    </ToolPage>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <ToolMeta className="w-36 shrink-0">{label}</ToolMeta>
      <code
        className={`flex-1 break-all text-[13px] leading-relaxed text-foreground ${
          mono ? "font-mono" : "font-mono"
        }`}
      >
        {value}
      </code>
      <CopyButton text={value} />
    </div>
  );
}

function FlagList({ info }: { info: CidrInfo }) {
  const flags: string[] = [];
  if (info.isPrivate) flags.push("private");
  if (info.isLoopback) flags.push("loopback");
  if (info.isLinkLocal) flags.push("link-local");
  if (info.isMulticast) flags.push("multicast");

  if (flags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {flags.map((flag) => (
        <span
          key={flag}
          className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground"
        >
          {flag}
        </span>
      ))}
    </div>
  );
}

function formatInfoForCopy(info: CidrInfo): string {
  const lines: string[] = [
    `Address: ${info.address}/${info.prefix}`,
    `Network: ${info.network}`,
  ];
  if (info.broadcast) lines.push(`Broadcast: ${info.broadcast}`);
  if (info.firstHost) lines.push(`First Host: ${info.firstHost}`);
  if (info.lastHost) lines.push(`Last Host: ${info.lastHost}`);
  lines.push(`Range: ${info.rangeStart} – ${info.rangeEnd}`);
  lines.push(`Netmask: ${info.netmask}`);
  if (info.wildcard) lines.push(`Wildcard: ${info.wildcard}`);
  lines.push(`Total: ${info.totalHostCount}`);
  lines.push(`Usable: ${info.usableHostCount}`);
  return lines.join("\n");
}
