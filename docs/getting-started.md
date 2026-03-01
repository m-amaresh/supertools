# Getting Started

## Local Run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Build and Checks

```bash
pnpm -s exec biome check src/app src/components src/hooks src/lib next.config.ts
pnpm -s test:run
pnpm -s exec tsc --noEmit
pnpm -s build
```

## Basic Usage

1. Open a tool from the home page or sidebar.
2. Enter input text (or upload a file where supported).
3. Use toolbar actions (`Format`, `Convert`, `Generate`, `Copy`, `Clear`) as needed.
4. Copy the output.

## Notes

- Tool transformations run client-side in the browser.
- Some app shell assets can still be fetched over network (for example page/app static assets).
