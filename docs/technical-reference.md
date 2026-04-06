# Technical Reference

This page is the practical reference for maintainers. It collects the implementation details that are easy to forget and expensive to relearn.

## Required Validation

Run these before release and before merging meaningful changes:

```bash
pnpm lint
pnpm test:run
pnpm exec tsc --noEmit
pnpm build
```

## Runtime and Build Notes

- Package manager: `pnpm`
- Node target: `24.x`
- Framework: Next.js 16 App Router
- TypeScript: `6.0.2`
- Linting/formatting: Biome
- Unit tests: Vitest

## Shared Hooks

### `useToolState`

File: [`src/hooks/useToolState.ts`](/home/sonum/projects/supertools/src/hooks/useToolState.ts)

Use this when a tool has the common trio of:

- `input`
- `output`
- `error`

It also provides a standard clear handler and a clipboard paste helper. If a tool has multiple primary inputs or more complex validation, use custom state instead of forcing everything through this hook.

### `useClipboard`

File: [`src/hooks/useClipboard.ts`](/home/sonum/projects/supertools/src/hooks/useClipboard.ts)

Provides:

- clipboard copy feedback
- clipboard read support
- transient paste error state

## Common Utilities

### Constants

File: [`src/lib/constants.ts`](/home/sonum/projects/supertools/src/lib/constants.ts)

Shared values such as text encoding options and input thresholds belong here instead of being repeated across tools.

### Class Merging and Small Helpers

File: [`src/lib/utils.ts`](/home/sonum/projects/supertools/src/lib/utils.ts)

This is the right place for narrow reusable helpers like class merging and strict integer parsing.

## SEO and Indexing

Relevant files:

- [`src/lib/site.ts`](/home/sonum/projects/supertools/src/lib/site.ts)
- [`src/lib/seo.ts`](/home/sonum/projects/supertools/src/lib/seo.ts)
- [`src/lib/tool-seo.ts`](/home/sonum/projects/supertools/src/lib/tool-seo.ts)
- [`src/app/sitemap.ts`](/home/sonum/projects/supertools/src/app/sitemap.ts)
- [`src/app/robots.ts`](/home/sonum/projects/supertools/src/app/robots.ts)

Important detail:

- `NEXT_PUBLIC_SITE_URL` should be set in production.
- If it is missing, the shared site helper can fall back to localhost, which is unacceptable for a real deployment.

## Security Baseline

- Security headers and CSP are configured in [`next.config.ts`](/home/sonum/projects/supertools/next.config.ts).
- Do not use `dangerouslySetInnerHTML` or raw HTML injection patterns. The global error page uses pure inline styles for this reason.
- Do not log sensitive payload content to analytics.
- Keep claims about encryption, signatures, and verification accurate to the implemented behavior.
- The global focus outline is suppressed in `globals.css` so that component-level `focus-visible:ring-*` styles are the sole source of focus indicators, preventing double-ring conflicts.

## Testing Strategy

Most regression coverage lives next to the pure logic in [`src/lib`](/home/sonum/projects/supertools/src/lib). That is intentional:

- it keeps tests fast
- it avoids over-coupling tests to page markup
- it protects the logic that is easiest to regress silently

When a user-facing bug comes from parsing, conversion, validation, or flag handling, start by writing a small lib-level regression test.

## Tool Authoring Guidance

When adding or refactoring a tool:

1. put the transformation logic in `src/lib`
2. keep the page focused on state and UI orchestration
3. add limits for heavy work
4. add or update tests
5. wire SEO metadata and FAQ content if the route is public
6. update docs when behavior changes materially
