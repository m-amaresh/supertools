# Architecture

SuperTools is a Next.js App Router application with a simple architectural rule: keep tool logic predictable, portable, and local to the browser whenever possible.

## High-Level Shape

```text
src/
  app/                  Routes, layouts, metadata, global styles, tool pages
  components/           App shell and reusable UI composition
  components/ui/        shadcn/ui primitives
  hooks/                Small reusable client hooks
  lib/                  Pure logic, parsers, generators, SEO helpers, utilities

docs/                   Project documentation
public/                 Static assets
```

## Main Layers

### `src/lib`

This is where most of the real work belongs:

- encoders and decoders
- parsers and formatters
- generators
- validation helpers
- route metadata and SEO helpers

The goal is to keep this layer mostly framework-independent and easy to test.

### `src/app/tools`

Tool pages live here. A page should mostly do orchestration:

- manage UI state
- call into `src/lib`
- wire up toolbar actions
- render the shared scaffold consistently

When tool logic starts getting large inside a page file, it usually belongs in `src/lib`.

### `src/components`

This layer holds:

- the app shell
- the header and sidebar
- shared tool layout primitives
- status and FAQ components
- small reusable UI composition pieces

### `src/hooks`

The hook layer is intentionally small and focused:

- [`useToolState`](/home/sonum/projects/supertools/src/hooks/useToolState.ts) for common input/output/error state
- [`useClipboard`](/home/sonum/projects/supertools/src/hooks/useClipboard.ts) for clipboard actions and feedback

## Tool Page Pattern

Most tools follow the same basic shape:

1. initialize state
2. call pure helpers from `src/lib`
3. render the shared scaffold
4. show success, warning, and error states clearly

This consistency is deliberate. Users should not have to relearn the UI for every tool.

## Shared Product Decisions

### Browser-First Processing

Core payload transformations are intended to run on the client. That supports the product’s privacy position and keeps most tools fast and dependency-light.

### Defensive Limits

Large inputs and heavy operations should have clear guardrails. A tool should degrade honestly instead of pretending everything is fine while freezing the tab.

### SEO by Convention

Metadata, tool intent keywords, FAQ content, canonical handling, sitemap output, and structured data are centralized instead of being hand-authored ad hoc on every route.

Relevant files:

- [`src/lib/seo.ts`](/home/sonum/projects/supertools/src/lib/seo.ts)
- [`src/lib/tool-seo.ts`](/home/sonum/projects/supertools/src/lib/tool-seo.ts)
- [`src/lib/site.ts`](/home/sonum/projects/supertools/src/lib/site.ts)
- [`src/components/SeoFaq.tsx`](/home/sonum/projects/supertools/src/components/SeoFaq.tsx)
- [`src/components/ToolSeoFaqServer.tsx`](/home/sonum/projects/supertools/src/components/ToolSeoFaqServer.tsx)

## App Shell and Runtime Concerns

- The global shell lives in [`src/components/AppShell.tsx`](/home/sonum/projects/supertools/src/components/AppShell.tsx).
- Light, dark, and system themes are handled by `next-themes`. System mode tracks the OS preference and updates live when it changes.
- Security headers and CSP are set in [`next.config.ts`](/home/sonum/projects/supertools/next.config.ts).

## What This App Does Not Try to Be

- a multi-user platform
- a cloud sync product
- a backend processing service
- a generic CMS for arbitrary tool pages

Keeping the scope narrow is part of how the app stays understandable.
