# SuperTools

SuperTools is a privacy-first suite of developer/data utilities that run fully in the browser.

## Core Principles

- Client-side processing only
- No backend compute for tool payloads
- Consistent, accessible UI patterns
- Defensive limits for large inputs/files

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + global design tokens
- Official shadcn/ui components (`components.json`, `src/components/ui/*`)
- `next-themes` for FOUC-free theme management
- Biome (format/check)
- pnpm

## Local Development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality Gates

```bash
pnpm -s exec biome check src/app src/components src/hooks src/lib next.config.ts
pnpm -s test:run
pnpm -s exec tsc --noEmit
pnpm -s build
```

## Project Documentation

- Public docs index:
  - `docs/README.md`
- Getting started:
  - `docs/getting-started.md`
- Privacy:
  - `docs/privacy.md`
- Architecture:
  - `docs/architecture.md`
- Technical reference:
  - `docs/technical-reference.md`
- Tool catalog/objectives:
  - `docs/tool-catalog.md`

## Tool Coverage

Current categories include:
- Encoding/Crypto
- Data formatting/conversion
- Text utilities
- Time utilities
- ID/password generation

All tools are designed to keep processing local to the browser.
