export type SidebarToolCategory =
  | "Generators"
  | "Encoders"
  | "Formatters"
  | "Text"
  | "Time";

export type ToolIconKey =
  | "hash"
  | "key"
  | "fingerprint"
  | "alignLeft"
  | "code2"
  | "calculator"
  | "heading2"
  | "link2"
  | "ticket"
  | "shield"
  | "lock"
  | "penLine"
  | "fileCode"
  | "arrowLeftRight"
  | "palette"
  | "workflow"
  | "gitCompareArrows"
  | "aLargeSmall"
  | "asterisk"
  | "clock"
  | "calendarDays";

export interface ToolDefinition {
  name: string;
  description: string;
  href: string;
  available: boolean;
  featured: boolean;
  homeOrder: number;
  sidebarCategory: SidebarToolCategory;
  sidebarLabel: string;
  sidebarOrder: number;
  icon: ToolIconKey;
}

export interface SidebarToolGroup {
  name: SidebarToolCategory;
  tools: ToolDefinition[];
}

const sidebarCategoryOrder: SidebarToolCategory[] = [
  "Generators",
  "Encoders",
  "Formatters",
  "Text",
  "Time",
];

export const toolDefinitions: ToolDefinition[] = [
  {
    name: "UUID Generator",
    description: "Generate UUIDs with formatting options",
    href: "/tools/ids/uuid",
    available: true,
    featured: true,
    homeOrder: 1,
    sidebarCategory: "Generators",
    sidebarLabel: "UUID",
    sidebarOrder: 1,
    icon: "hash",
  },
  {
    name: "Password Generator",
    description: "Cryptographically secure random passwords",
    href: "/tools/ids/password",
    available: true,
    featured: true,
    homeOrder: 2,
    sidebarCategory: "Generators",
    sidebarLabel: "Password",
    sidebarOrder: 2,
    icon: "key",
  },
  {
    name: "Base64",
    description: "Encode and decode Base64",
    href: "/tools/encode/base64",
    available: true,
    featured: true,
    homeOrder: 3,
    sidebarCategory: "Encoders",
    sidebarLabel: "Base64",
    sidebarOrder: 1,
    icon: "code2",
  },
  {
    name: "Base32",
    description: "Encode and decode Base32",
    href: "/tools/encode/base32",
    available: true,
    featured: true,
    homeOrder: 5,
    sidebarCategory: "Encoders",
    sidebarLabel: "Base32",
    sidebarOrder: 3,
    icon: "calculator",
  },
  {
    name: "Hex Encoder/Decoder",
    description: "Convert between text and hex",
    href: "/tools/encode/hex",
    available: true,
    featured: true,
    homeOrder: 6,
    sidebarCategory: "Encoders",
    sidebarLabel: "Hex",
    sidebarOrder: 4,
    icon: "heading2",
  },
  {
    name: "JSON Formatter",
    description: "Format and validate JSON",
    href: "/tools/data/json",
    available: true,
    featured: true,
    homeOrder: 7,
    sidebarCategory: "Formatters",
    sidebarLabel: "JSON",
    sidebarOrder: 1,
    icon: "fileCode",
  },
  {
    name: "Text Diff",
    description: "Compare two texts side by side",
    href: "/tools/text/diff",
    available: true,
    featured: false,
    homeOrder: 8,
    sidebarCategory: "Text",
    sidebarLabel: "Diff",
    sidebarOrder: 1,
    icon: "gitCompareArrows",
  },
  {
    name: "Timestamp",
    description: "Unix ↔ ISO conversion",
    href: "/tools/time/timestamp",
    available: true,
    featured: false,
    homeOrder: 9,
    sidebarCategory: "Time",
    sidebarLabel: "Timestamp",
    sidebarOrder: 1,
    icon: "clock",
  },
  {
    name: "Hash Generator",
    description: "MD5, SHA, SHA3, HMAC",
    href: "/tools/encode/hash",
    available: true,
    featured: false,
    homeOrder: 10,
    sidebarCategory: "Generators",
    sidebarLabel: "Hash",
    sidebarOrder: 3,
    icon: "fingerprint",
  },
  {
    name: "CRC32 Checksum",
    description: "Fast checksums for text and files",
    href: "/tools/encode/crc32",
    available: true,
    featured: false,
    homeOrder: 11,
    sidebarCategory: "Encoders",
    sidebarLabel: "CRC32",
    sidebarOrder: 8,
    icon: "hash",
  },
  {
    name: "AES-GCM",
    description: "Encrypt/decrypt text and files",
    href: "/tools/encode/aes",
    available: true,
    featured: false,
    homeOrder: 12,
    sidebarCategory: "Encoders",
    sidebarLabel: "AES-GCM",
    sidebarOrder: 9,
    icon: "lock",
  },
  {
    name: "RSA Sign/Verify",
    description: "Sign and verify with PEM keys",
    href: "/tools/encode/rsa",
    available: true,
    featured: false,
    homeOrder: 13,
    sidebarCategory: "Encoders",
    sidebarLabel: "RSA Sign/Verify",
    sidebarOrder: 10,
    icon: "penLine",
  },
  {
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL components",
    href: "/tools/encode/url",
    available: true,
    featured: false,
    homeOrder: 14,
    sidebarCategory: "Encoders",
    sidebarLabel: "URL Encode",
    sidebarOrder: 5,
    icon: "link2",
  },
  {
    name: "Case Converter",
    description: "camelCase, snake_case, and more",
    href: "/tools/text/case",
    available: true,
    featured: false,
    homeOrder: 15,
    sidebarCategory: "Text",
    sidebarLabel: "Case Converter",
    sidebarOrder: 2,
    icon: "aLargeSmall",
  },
  {
    name: "Regex Tester",
    description: "Live matching with capture groups",
    href: "/tools/text/regex",
    available: true,
    featured: false,
    homeOrder: 16,
    sidebarCategory: "Text",
    sidebarLabel: "Regex Tester",
    sidebarOrder: 3,
    icon: "asterisk",
  },
  {
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text",
    href: "/tools/text/lorem",
    available: true,
    featured: false,
    homeOrder: 17,
    sidebarCategory: "Generators",
    sidebarLabel: "Lorem Ipsum",
    sidebarOrder: 4,
    icon: "alignLeft",
  },
  {
    name: "Number Base Converter",
    description: "Binary, octal, decimal, hex",
    href: "/tools/data/baseconv",
    available: true,
    featured: false,
    homeOrder: 18,
    sidebarCategory: "Formatters",
    sidebarLabel: "Number Base",
    sidebarOrder: 2,
    icon: "arrowLeftRight",
  },
  {
    name: "JWT Decoder",
    description: "Decode tokens, check expiration",
    href: "/tools/encode/jwt",
    available: true,
    featured: false,
    homeOrder: 19,
    sidebarCategory: "Encoders",
    sidebarLabel: "JWT Decoder",
    sidebarOrder: 6,
    icon: "ticket",
  },
  {
    name: "String Escape/Unescape",
    description: "HTML, JSON, URL, regex escaping",
    href: "/tools/encode/escape",
    available: true,
    featured: false,
    homeOrder: 20,
    sidebarCategory: "Encoders",
    sidebarLabel: "String Escape",
    sidebarOrder: 7,
    icon: "shield",
  },
  {
    name: "Color Converter",
    description: "HEX, RGB, HSL with palette",
    href: "/tools/data/color",
    available: true,
    featured: false,
    homeOrder: 21,
    sidebarCategory: "Formatters",
    sidebarLabel: "Color Converter",
    sidebarOrder: 3,
    icon: "palette",
  },
  {
    name: "YAML Converter",
    description: "JSON ↔ YAML with YAML validation",
    href: "/tools/data/yaml",
    available: true,
    featured: false,
    homeOrder: 22,
    sidebarCategory: "Formatters",
    sidebarLabel: "YAML",
    sidebarOrder: 4,
    icon: "workflow",
  },
  {
    name: "Cron Expression Parser",
    description: "Human-readable cron with next runs",
    href: "/tools/time/cron",
    available: true,
    featured: false,
    homeOrder: 23,
    sidebarCategory: "Time",
    sidebarLabel: "Cron Parser / Builder",
    sidebarOrder: 2,
    icon: "calendarDays",
  },
  {
    name: "CSV/TSV ↔ JSON",
    description: "Convert delimited text and JSON arrays",
    href: "/tools/data/csv",
    available: true,
    featured: false,
    homeOrder: 24,
    sidebarCategory: "Formatters",
    sidebarLabel: "CSV/TSV ↔ JSON",
    sidebarOrder: 5,
    icon: "workflow",
  },
  {
    name: "URL Parser & Builder",
    description: "Inspect URL parts and edit query params",
    href: "/tools/encode/url-parser",
    available: true,
    featured: false,
    homeOrder: 25,
    sidebarCategory: "Encoders",
    sidebarLabel: "URL Parser",
    sidebarOrder: 11,
    icon: "link2",
  },
  {
    name: "Base58/Base58Check",
    description: "Encode/decode Base58 and Base58Check",
    href: "/tools/encode/base58",
    available: true,
    featured: false,
    homeOrder: 4,
    sidebarCategory: "Encoders",
    sidebarLabel: "Base58",
    sidebarOrder: 2,
    icon: "calculator",
  },
  {
    name: "TLS Certificate Viewer",
    description: "Inspect PEM certificate fields and fingerprints",
    href: "/tools/encode/tls-cert",
    available: true,
    featured: false,
    homeOrder: 26,
    sidebarCategory: "Encoders",
    sidebarLabel: "TLS Cert Viewer",
    sidebarOrder: 12,
    icon: "shield",
  },
];

export const homeTools = [...toolDefinitions].sort(
  (a, b) => a.homeOrder - b.homeOrder,
);

export const featuredTools = homeTools.filter((tool) => tool.featured);

export const sidebarToolGroups: SidebarToolGroup[] = sidebarCategoryOrder.map(
  (category) => ({
    name: category,
    tools: toolDefinitions
      .filter((tool) => tool.sidebarCategory === category)
      .sort((a, b) => a.sidebarOrder - b.sidebarOrder),
  }),
);
