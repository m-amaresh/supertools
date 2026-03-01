# Contributing to SuperTools

Thank you for contributing.

Before opening a PR, read:
- `docs/README.md`
- `docs/architecture.md`
- `docs/technical-reference.md`

## Core Rules

1. Keep tool processing client-side.
2. Follow existing tool UI contract:
   - toolbar at top
   - options bar at top (below toolbar)
   - global status stack via `AlertBox`
3. Place tool logic in `src/lib/*` and keep page components focused on orchestration/UI.
4. Add size guards for heavy text/file operations.
5. Keep tool footnotes explicit about local-only processing.

## Structure

- Tool pages: `src/app/tools/<category>/<tool>/page.tsx`
- Shared UI: `src/components/*`
- Tool logic: `src/lib/*`
- App shell/nav: `src/components/AppShell.tsx`, `src/components/Header.tsx`, `src/components/Sidebar.tsx`
- Theme: `src/components/ThemeProvider.tsx` (wraps `next-themes`)
- Security policy: `src/proxy.ts`, `next.config.ts`

## Security Expectations

- No `dangerouslySetInnerHTML` or raw HTML injection patterns.
- Validate attacker-controlled input formats and cost factors.
- Never claim cryptographic verification if not implemented.
- Respect CSP and avoid introducing inline-script requirements.

## Local Validation (Required)

Run all four before PR:

```bash
pnpm -s exec biome check src/app src/components src/hooks src/lib src/proxy.ts next.config.ts
pnpm -s test:run
pnpm -s exec tsc --noEmit
pnpm -s build
```

## Pull Requests

Use the PR template and complete all checklist sections.

## Issues

Use issue templates:
- Bug report
- Feature request

Security vulnerabilities must not be filed publicly.
