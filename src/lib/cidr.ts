export type IpVersion = 4 | 6;

export interface CidrInfo {
  version: IpVersion;
  address: string;
  prefix: number;
  network: string;
  broadcast: string | null;
  firstHost: string | null;
  lastHost: string | null;
  usableHostCount: string;
  totalHostCount: string;
  netmask: string;
  wildcard: string | null;
  rangeStart: string;
  rangeEnd: string;
  binaryNetwork: string;
  hexNetwork: string;
  ipClass: string | null;
  isPrivate: boolean;
  isLoopback: boolean;
  isLinkLocal: boolean;
  isMulticast: boolean;
}

export interface CidrResult {
  info: CidrInfo | null;
  error: string | null;
}

const IPV4_BITS = 32n;
const IPV6_BITS = 128n;
const IPV4_MASK = (1n << IPV4_BITS) - 1n;
const IPV6_MASK = (1n << IPV6_BITS) - 1n;

function parseIpv4(input: string): bigint | null {
  const parts = input.split(".");
  if (parts.length !== 4) return null;

  let value = 0n;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    const octet = Number.parseInt(part, 10);
    if (octet < 0 || octet > 255) return null;
    value = (value << 8n) | BigInt(octet);
  }
  return value;
}

// Expand :: shorthand and parse each 16-bit group. Supports the embedded
// IPv4 tail form (e.g. ::ffff:192.0.2.1) used for IPv4-mapped addresses.
function parseIpv6(input: string): bigint | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let head = trimmed;
  let embeddedV4: bigint | null = null;

  const lastColon = trimmed.lastIndexOf(":");
  const tail = lastColon === -1 ? "" : trimmed.slice(lastColon + 1);
  if (tail.includes(".")) {
    const v4 = parseIpv4(tail);
    if (v4 === null) return null;
    embeddedV4 = v4;
    head = trimmed.slice(0, lastColon);
  }

  const doubleColonCount = (head.match(/::/g) ?? []).length;
  if (doubleColonCount > 1) return null;

  let leftGroups: string[] = [];
  let rightGroups: string[] = [];

  if (doubleColonCount === 1) {
    const [left, right] = head.split("::");
    leftGroups = left ? left.split(":") : [];
    rightGroups = right ? right.split(":") : [];
  } else {
    leftGroups = head ? head.split(":") : [];
  }

  const targetGroupCount = embeddedV4 !== null ? 6 : 8;
  const filledCount = leftGroups.length + rightGroups.length;
  if (filledCount > targetGroupCount) return null;
  if (doubleColonCount === 0 && filledCount !== targetGroupCount) return null;

  const missing = targetGroupCount - filledCount;
  const zeros = new Array(missing).fill("0");
  const groups = [...leftGroups, ...zeros, ...rightGroups];

  let value = 0n;
  for (const group of groups) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(group)) return null;
    value = (value << 16n) | BigInt(Number.parseInt(group, 16));
  }

  if (embeddedV4 !== null) {
    value = (value << 32n) | embeddedV4;
  }

  return value;
}

function ipv4ToString(value: bigint): string {
  const parts: string[] = [];
  for (let shift = 24n; shift >= 0n; shift -= 8n) {
    parts.push(String(Number((value >> shift) & 0xffn)));
  }
  return parts.join(".");
}

// Format a 128-bit value as a compressed IPv6 string using the longest run
// of zero groups for :: (RFC 5952).
function ipv6ToString(value: bigint): string {
  const groups: string[] = [];
  for (let i = 7n; i >= 0n; i--) {
    groups.push(Number((value >> (i * 16n)) & 0xffffn).toString(16));
  }

  let bestStart = -1;
  let bestLen = 0;
  let runStart = -1;
  let runLen = 0;

  for (let i = 0; i < groups.length; i++) {
    if (groups[i] === "0") {
      if (runStart === -1) {
        runStart = i;
        runLen = 1;
      } else {
        runLen++;
      }
      if (runLen > bestLen) {
        bestStart = runStart;
        bestLen = runLen;
      }
    } else {
      runStart = -1;
      runLen = 0;
    }
  }

  if (bestLen < 2) return groups.join(":");

  const head = groups.slice(0, bestStart).join(":");
  const tail = groups.slice(bestStart + bestLen).join(":");
  return `${head}::${tail}`;
}

function ipv4Netmask(prefix: number): bigint {
  if (prefix === 0) return 0n;
  return (IPV4_MASK << BigInt(32 - prefix)) & IPV4_MASK;
}

function ipv6Netmask(prefix: number): bigint {
  if (prefix === 0) return 0n;
  return (IPV6_MASK << BigInt(128 - prefix)) & IPV6_MASK;
}

function ipv4BinaryDotted(value: bigint): string {
  const parts: string[] = [];
  for (let shift = 24n; shift >= 0n; shift -= 8n) {
    parts.push(
      Number((value >> shift) & 0xffn)
        .toString(2)
        .padStart(8, "0"),
    );
  }
  return parts.join(".");
}

function ipv6BinaryGrouped(value: bigint): string {
  const groups: string[] = [];
  for (let i = 7n; i >= 0n; i--) {
    groups.push(
      Number((value >> (i * 16n)) & 0xffffn)
        .toString(2)
        .padStart(16, "0"),
    );
  }
  return groups.join(":");
}

function ipv4Class(value: bigint): string {
  const firstOctet = Number((value >> 24n) & 0xffn);
  if (firstOctet < 128) return "A";
  if (firstOctet < 192) return "B";
  if (firstOctet < 224) return "C";
  if (firstOctet < 240) return "D (multicast)";
  return "E (reserved)";
}

// RFC 1918 + RFC 6598 carrier-grade NAT ranges.
function ipv4IsPrivate(value: bigint): boolean {
  const a = Number((value >> 24n) & 0xffn);
  const b = Number((value >> 16n) & 0xffn);
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function ipv4IsLoopback(value: bigint): boolean {
  return Number((value >> 24n) & 0xffn) === 127;
}

function ipv4IsLinkLocal(value: bigint): boolean {
  return (
    Number((value >> 24n) & 0xffn) === 169 &&
    Number((value >> 16n) & 0xffn) === 254
  );
}

function ipv4IsMulticast(value: bigint): boolean {
  const a = Number((value >> 24n) & 0xffn);
  return a >= 224 && a <= 239;
}

function ipv6IsLoopback(value: bigint): boolean {
  return value === 1n;
}

function ipv6IsLinkLocal(value: bigint): boolean {
  // fe80::/10
  return value >> 118n === 0x3fan;
}

function ipv6IsMulticast(value: bigint): boolean {
  // ff00::/8
  return value >> 120n === 0xffn;
}

function ipv6IsPrivate(value: bigint): boolean {
  // fc00::/7 (unique local addresses)
  return value >> 121n === 0x7en;
}

function buildIpv4Info(address: bigint, prefix: number): CidrInfo {
  const mask = ipv4Netmask(prefix);
  const network = address & mask;
  const broadcast = network | (~mask & IPV4_MASK);
  const total = 1n << BigInt(32 - prefix);
  const usable = prefix >= 31 ? total : total - 2n;

  const firstHost =
    prefix >= 31 ? network : network === broadcast ? network : network + 1n;
  const lastHost =
    prefix >= 31
      ? broadcast
      : network === broadcast
        ? broadcast
        : broadcast - 1n;

  return {
    version: 4,
    address: ipv4ToString(address),
    prefix,
    network: ipv4ToString(network),
    broadcast: ipv4ToString(broadcast),
    firstHost: usable === 0n ? null : ipv4ToString(firstHost),
    lastHost: usable === 0n ? null : ipv4ToString(lastHost),
    usableHostCount: usable.toString(),
    totalHostCount: total.toString(),
    netmask: ipv4ToString(mask),
    wildcard: ipv4ToString(~mask & IPV4_MASK),
    rangeStart: ipv4ToString(network),
    rangeEnd: ipv4ToString(broadcast),
    binaryNetwork: ipv4BinaryDotted(network),
    hexNetwork: network.toString(16).padStart(8, "0").toUpperCase(),
    ipClass: ipv4Class(address),
    isPrivate: ipv4IsPrivate(address),
    isLoopback: ipv4IsLoopback(address),
    isLinkLocal: ipv4IsLinkLocal(address),
    isMulticast: ipv4IsMulticast(address),
  };
}

function buildIpv6Info(address: bigint, prefix: number): CidrInfo {
  const mask = ipv6Netmask(prefix);
  const network = address & mask;
  const rangeEnd = network | (~mask & IPV6_MASK);
  const total = 1n << BigInt(128 - prefix);

  return {
    version: 6,
    address: ipv6ToString(address),
    prefix,
    network: ipv6ToString(network),
    broadcast: null,
    firstHost: total === 1n ? ipv6ToString(network) : ipv6ToString(network),
    lastHost: total === 1n ? ipv6ToString(rangeEnd) : ipv6ToString(rangeEnd),
    usableHostCount: total.toString(),
    totalHostCount: total.toString(),
    netmask: ipv6ToString(mask),
    wildcard: null,
    rangeStart: ipv6ToString(network),
    rangeEnd: ipv6ToString(rangeEnd),
    binaryNetwork: ipv6BinaryGrouped(network),
    hexNetwork: network.toString(16).padStart(32, "0").toUpperCase(),
    ipClass: null,
    isPrivate: ipv6IsPrivate(address),
    isLoopback: ipv6IsLoopback(address),
    isLinkLocal: ipv6IsLinkLocal(address),
    isMulticast: ipv6IsMulticast(address),
  };
}

// Parse a CIDR expression ("192.168.1.0/24", "2001:db8::/32", or a bare IP).
// A bare IP without a prefix is treated as /32 (v4) or /128 (v6).
export function parseCidr(input: string): CidrResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { info: null, error: null };
  }

  const slashIndex = trimmed.indexOf("/");
  const addressPart =
    slashIndex === -1 ? trimmed : trimmed.slice(0, slashIndex);
  const prefixPart = slashIndex === -1 ? null : trimmed.slice(slashIndex + 1);

  const isV6 = addressPart.includes(":");

  if (isV6) {
    const addr = parseIpv6(addressPart);
    if (addr === null) {
      return { info: null, error: "Invalid IPv6 address" };
    }

    let prefix = 128;
    if (prefixPart !== null) {
      if (!/^\d+$/.test(prefixPart)) {
        return { info: null, error: "Invalid prefix length" };
      }
      prefix = Number.parseInt(prefixPart, 10);
      if (prefix < 0 || prefix > 128) {
        return { info: null, error: "IPv6 prefix must be between 0 and 128" };
      }
    }

    return { info: buildIpv6Info(addr, prefix), error: null };
  }

  const addr = parseIpv4(addressPart);
  if (addr === null) {
    return { info: null, error: "Invalid IPv4 address" };
  }

  let prefix = 32;
  if (prefixPart !== null) {
    if (!/^\d+$/.test(prefixPart)) {
      return { info: null, error: "Invalid prefix length" };
    }
    prefix = Number.parseInt(prefixPart, 10);
    if (prefix < 0 || prefix > 32) {
      return { info: null, error: "IPv4 prefix must be between 0 and 32" };
    }
  }

  return { info: buildIpv4Info(addr, prefix), error: null };
}
