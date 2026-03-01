export interface ToolSeoFaqItem {
  question: string;
  answer: string;
}

export interface ToolSeoFaqSection {
  title: string;
  items: ToolSeoFaqItem[];
}

export const TOOL_INTENT_KEYWORDS: Record<string, string[]> = {
  "/tools/ids/uuid": [
    "uuid generator",
    "uuid v4 generator",
    "generate uuid",
    "uuid online",
  ],
  "/tools/ids/password": [
    "password generator",
    "strong password generator",
    "secure password",
    "random password",
  ],
  "/tools/encode/base64": [
    "base64 encode",
    "base64 decode",
    "base64 encoder",
    "base64 decoder",
  ],
  "/tools/encode/base32": [
    "base32 encode",
    "base32 decode",
    "base32 encoder",
    "base32 decoder",
  ],
  "/tools/encode/hex": [
    "hex encoder",
    "hex decoder",
    "text to hex",
    "hex to text",
  ],
  "/tools/data/json": [
    "json formatter",
    "json beautifier",
    "json minify",
    "json validator",
  ],
  "/tools/text/diff": [
    "text diff",
    "compare text",
    "diff checker",
    "line by line diff",
  ],
  "/tools/time/timestamp": [
    "timestamp converter",
    "unix timestamp converter",
    "epoch converter",
    "unix to date",
  ],
  "/tools/encode/hash": [
    "hash generator",
    "sha256 generator",
    "md5 hash",
    "hmac generator",
  ],
  "/tools/encode/crc32": [
    "crc32",
    "crc32 checksum",
    "crc32 generator",
    "file checksum",
  ],
  "/tools/encode/aes": [
    "aes gcm",
    "aes encrypt",
    "aes decrypt",
    "encrypt text online",
  ],
  "/tools/encode/rsa": [
    "rsa sign",
    "rsa verify",
    "rsa signature",
    "pem key verify",
  ],
  "/tools/encode/url": [
    "url encoder",
    "url decoder",
    "encode url",
    "decode url",
  ],
  "/tools/text/case": [
    "case converter",
    "camelcase converter",
    "snake case converter",
    "kebab case converter",
  ],
  "/tools/text/regex": [
    "regex tester",
    "regular expression tester",
    "regex checker",
    "regex playground",
  ],
  "/tools/text/lorem": [
    "lorem ipsum generator",
    "placeholder text generator",
    "dummy text",
    "lorem generator",
  ],
  "/tools/data/baseconv": [
    "number base converter",
    "binary to decimal",
    "decimal to hex",
    "base conversion",
  ],
  "/tools/encode/jwt": [
    "jwt decoder",
    "decode jwt",
    "jwt payload decoder",
    "jwt token inspector",
  ],
  "/tools/encode/escape": [
    "string escape",
    "html escape",
    "json escape",
    "regex escape",
  ],
  "/tools/data/color": [
    "color converter",
    "hex to rgb",
    "rgb to hsl",
    "color palette generator",
  ],
  "/tools/data/yaml": [
    "yaml converter",
    "yaml to json",
    "json to yaml",
    "yaml validator",
  ],
  "/tools/time/cron": [
    "cron parser",
    "cron expression parser",
    "cron builder",
    "cron next run",
  ],
};

export const TOOL_FAQ_BY_PATH: Record<string, ToolSeoFaqSection> = {
  "/tools/ids/uuid": {
    title: "UUID Generator FAQ",
    items: [
      {
        question: "Which UUID version does this tool generate?",
        answer:
          "It generates UUID v4 values using browser cryptographic randomness.",
      },
      {
        question: "Can I generate multiple UUIDs at once?",
        answer:
          "Yes, you can generate UUIDs in bulk and copy the list directly from the tool.",
      },
    ],
  },
  "/tools/ids/password": {
    title: "Password Generator FAQ",
    items: [
      {
        question: "Are generated passwords secure?",
        answer:
          "Yes, passwords use cryptographically secure random values from your browser.",
      },
      {
        question: "Can I exclude specific characters?",
        answer:
          "Yes, you can include or exclude character sets and remove ambiguous characters.",
      },
    ],
  },
  "/tools/encode/base64": {
    title: "Base64 Encoder/Decoder FAQ",
    items: [
      {
        question: "What is Base64 used for?",
        answer:
          "Base64 converts binary or text data into ASCII-safe output for transport and storage in text systems.",
      },
      {
        question: "Is Base64 encryption?",
        answer: "No, Base64 is encoding only and can be reversed easily.",
      },
    ],
  },
  "/tools/encode/base32": {
    title: "Base32 Encoder/Decoder FAQ",
    items: [
      {
        question: "When should I use Base32 instead of Base64?",
        answer:
          "Base32 is useful in case-insensitive or restricted environments, such as OTP secrets and manual entry.",
      },
      {
        question: "Does this support padded and lowercase output?",
        answer:
          "Yes, you can output padded or unpadded Base32 and optionally lowercase text.",
      },
    ],
  },
  "/tools/encode/hex": {
    title: "Hex Encoder/Decoder FAQ",
    items: [
      {
        question: "Can I convert text to hexadecimal and back?",
        answer:
          "Yes. The tool supports encoding text to hex and decoding hex to text.",
      },
      {
        question: "Which text encodings are supported?",
        answer:
          "UTF-8, Latin-1, and raw hex-compatible input are supported depending on mode.",
      },
    ],
  },
  "/tools/data/json": {
    title: "JSON Formatter FAQ",
    items: [
      {
        question: "How do I format JSON online?",
        answer:
          "Paste JSON and click format. You can choose indentation and sort keys.",
      },
      {
        question: "Will invalid JSON be detected?",
        answer:
          "Yes, validation errors include location details when available.",
      },
    ],
  },
  "/tools/text/diff": {
    title: "Text Diff FAQ",
    items: [
      {
        question: "How is the diff calculated?",
        answer:
          "The tool compares text line-by-line and marks added, removed, and unchanged lines.",
      },
      {
        question: "Can I ignore whitespace or case?",
        answer:
          "Yes, options are available to ignore whitespace, case, and leading/trailing differences.",
      },
    ],
  },
  "/tools/time/timestamp": {
    title: "Timestamp Converter FAQ",
    items: [
      {
        question: "Can I convert Unix timestamps to human-readable dates?",
        answer:
          "Yes, Unix seconds and milliseconds are converted to ISO, UTC, local, and relative formats.",
      },
      {
        question: "Can I convert dates back to Unix time?",
        answer:
          "Yes, date inputs are parsed and converted back to Unix seconds and milliseconds.",
      },
    ],
  },
  "/tools/encode/hash": {
    title: "Hash Generator FAQ",
    items: [
      {
        question: "Which hash should I use for security?",
        answer:
          "Use SHA-256 or stronger for new systems. MD5 and SHA-1 are legacy compatibility options.",
      },
      {
        question: "What is HMAC?",
        answer:
          "HMAC is a keyed hash used for authenticity checks where both sides share a secret key.",
      },
    ],
  },
  "/tools/encode/crc32": {
    title: "CRC32 FAQ",
    items: [
      {
        question: "Is CRC32 cryptographically secure?",
        answer:
          "No. CRC32 is for error detection and integrity checks, not security.",
      },
      {
        question: "Can I checksum files with CRC32?",
        answer:
          "Yes, the tool supports both text and file-based CRC32 calculation.",
      },
    ],
  },
  "/tools/encode/aes": {
    title: "AES-GCM FAQ",
    items: [
      {
        question: "Which AES mode is used?",
        answer:
          "The tool uses AES-256-GCM with PBKDF2-SHA256 key derivation from your passphrase.",
      },
      {
        question: "Does encryption happen in the browser?",
        answer:
          "Yes, encryption and decryption run locally using the Web Crypto API.",
      },
    ],
  },
  "/tools/encode/rsa": {
    title: "RSA Sign/Verify FAQ",
    items: [
      {
        question: "Which key formats are supported?",
        answer:
          "Private keys should be PKCS#8 PEM and public keys should be SPKI PEM.",
      },
      {
        question: "Can this encrypt data with RSA?",
        answer:
          "No. This tool focuses on RSA signatures (sign and verify), not encryption.",
      },
    ],
  },
  "/tools/encode/url": {
    title: "URL Encoder/Decoder FAQ",
    items: [
      {
        question: "What is the difference between full URI and component mode?",
        answer:
          "Component mode encodes reserved characters more aggressively, while full URI mode preserves URL structure characters.",
      },
      {
        question: "Can I decode percent-encoded strings?",
        answer:
          "Yes, decode mode converts percent-encoded sequences back to readable text.",
      },
    ],
  },
  "/tools/text/case": {
    title: "Case Converter FAQ",
    items: [
      {
        question: "Which text cases are supported?",
        answer:
          "It supports camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, title case, and more.",
      },
      {
        question: "Can I convert multiple lines at once?",
        answer: "Yes, multi-line input is converted line by line.",
      },
    ],
  },
  "/tools/text/regex": {
    title: "Regex Tester FAQ",
    items: [
      {
        question: "Which regex engine is used?",
        answer:
          "The tool uses the browser JavaScript RegExp engine for matching behavior.",
      },
      {
        question: "Can I test capture groups and flags?",
        answer:
          "Yes, the tester displays match groups and supports standard JavaScript regex flags.",
      },
    ],
  },
  "/tools/text/lorem": {
    title: "Lorem Ipsum Generator FAQ",
    items: [
      {
        question: "Can I generate words, sentences, and paragraphs?",
        answer:
          "Yes, you can choose the output unit and quantity based on your content needs.",
      },
      {
        question: "Can output start with classic lorem ipsum text?",
        answer:
          "Yes, there is an option to start with the standard Lorem ipsum opening.",
      },
    ],
  },
  "/tools/data/baseconv": {
    title: "Number Base Converter FAQ",
    items: [
      {
        question: "Which number bases are supported?",
        answer:
          "Binary, octal, decimal, and hexadecimal are supported for conversion.",
      },
      {
        question: "Does it support very large numbers?",
        answer: "Yes, it uses BigInt for arbitrary precision conversion.",
      },
    ],
  },
  "/tools/encode/jwt": {
    title: "JWT Decoder FAQ",
    items: [
      {
        question: "Does this tool verify JWT signatures?",
        answer:
          "No, it decodes header and payload and shows metadata like exp and iat.",
      },
      {
        question: "Can I paste tokens with Bearer prefix?",
        answer:
          "Yes, Bearer prefixes are stripped automatically before decoding.",
      },
    ],
  },
  "/tools/encode/escape": {
    title: "String Escape FAQ",
    items: [
      {
        question: "Which escape modes are available?",
        answer:
          "HTML entities, JSON, URL percent encoding, and regex escaping are supported.",
      },
      {
        question: "Can escaped strings be reversed?",
        answer:
          "Yes, unescape mode is available for supported escaped formats.",
      },
    ],
  },
  "/tools/data/color": {
    title: "Color Converter FAQ",
    items: [
      {
        question: "Which color formats are supported?",
        answer:
          "HEX, RGB, and HSL inputs are parsed and converted between each format.",
      },
      {
        question: "Can I generate a related palette?",
        answer:
          "Yes, the tool can generate palette variations from a base color.",
      },
    ],
  },
  "/tools/data/yaml": {
    title: "YAML Converter FAQ",
    items: [
      {
        question: "Can I convert YAML to JSON and JSON to YAML?",
        answer:
          "Yes, conversion works in both directions with validation feedback.",
      },
      {
        question: "Can I sort keys during conversion?",
        answer:
          "Yes, key sorting is available for predictable output structure.",
      },
    ],
  },
  "/tools/time/cron": {
    title: "Cron Parser FAQ",
    items: [
      {
        question: "What cron format is supported?",
        answer:
          "The parser accepts standard five-field cron expressions: minute hour day month weekday.",
      },
      {
        question: "Can I preview upcoming run times?",
        answer:
          "Yes, it calculates and displays the next scheduled run times from now.",
      },
    ],
  },
};
