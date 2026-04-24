# Getting Started

This guide covers the practical setup for running SuperTools locally and the few deployment details that matter early.

## Requirements

- Node.js `24.x`
- pnpm

## Install and Run

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3100`.

## Everyday Commands

```bash
pnpm dev
pnpm lint
pnpm test:run
pnpm typecheck
pnpm build
pnpm start
```

## What to Expect Locally

- The app runs as a normal Next.js App Router project.
- Tool payloads are processed client-side.
- Theme supports three modes: light, dark, and system. System mode tracks the OS preference automatically. Users can cycle between light and dark manually; the preference persists across sessions.

## Environment Variables

Local development works without a `.env` file, but production should set:

- `NEXT_PUBLIC_SITE_URL`
- `GOOGLE_SITE_VERIFICATION` if you use Search Console verification
- `VERCEL_URL` and `VERCEL_ENV` when deployed on Vercel

### Why `NEXT_PUBLIC_SITE_URL` Matters

SuperTools uses a shared site URL helper for canonical metadata, sitemap output, robots, and structured data. If production falls back to `http://localhost:3000`, SEO signals will be wrong. Treat this as required in real deployments.

## Local Validation

Before opening a PR or cutting a release, run:

```bash
pnpm lint
pnpm test:run
pnpm typecheck
pnpm build
```

## First Places to Look in the Code

- [`src/app`](/home/sonum/projects/supertools/src/app): routes, layouts, metadata, and global styles
- [`src/components`](/home/sonum/projects/supertools/src/components): shared shell and UI composition
- [`src/lib`](/home/sonum/projects/supertools/src/lib): transformation logic, helpers, and SEO support
- [`src/hooks`](/home/sonum/projects/supertools/src/hooks): shared client hooks
