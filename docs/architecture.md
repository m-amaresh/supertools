# Architecture

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4 + semantic design tokens
- shadcn/ui components
- pnpm + Biome + Vitest

## Core Constraints

- Tool transformations run client-side in the browser.
- No backend compute pipeline for core tool payload processing.
- Avoid unsafe HTML rendering patterns.

## High-Level Structure

```text
src/
  app/                  # Routes, layout, globals, tool pages
  components/           # App shell + shared UI
  components/ui/        # shadcn/ui primitives
  hooks/                # Reusable React hooks
  lib/                  # Pure tool logic and helpers
public/                 # Static assets (including service worker)

.github/
  workflows/            # CI, CodeQL, dependency review workflows
  dependabot.yml        # Automated npm dependency update config
```

## Layering

- `src/lib/*`: pure transformation/parsing logic
- `src/app/tools/*`: tool page orchestration and UI
- `src/components/*`: reusable shell and UI composition
- `src/hooks/*`: reusable React hooks for common patterns

## Shared Utilities

### Hooks (`src/hooks/`)

- **`useToolState()`** - Manages common tool state (input, output, error) with built-in handlers for clear and paste operations. Used by 18+ tools.
- **`useClipboard()`** - Clipboard read/write with timeout management for copy/paste feedback.

### Utilities (`src/lib/utils.ts`)

- **`cn()`** - Tailwind class name merger using clsx + tailwind-merge
- **`parseStrictPositiveInt()`** - Parse and validate positive integer input (used by generators)

### Constants (`src/lib/constants.ts`)

- **`MAX_INPUT_SIZE`** - Performance warning threshold (1M characters)
- **`TEXT_ENCODING_OPTIONS`** - Standard encoding dropdown options (UTF-8, Latin-1, Hex)

### SEO (`src/lib/seo.ts`, `src/lib/tool-seo.ts`)

- `buildToolMetadata()` centralizes canonical, OpenGraph, Twitter metadata defaults.
- `TOOL_INTENT_KEYWORDS` maps tool routes to search-intent keywords.
- `TOOL_FAQ_BY_PATH` maps tool routes to FAQ content used for visible FAQ sections and JSON-LD schema.

## Tool Page Contract

### Standard State Pattern

Most tools use the `useToolState` hook for consistent state management:

```typescript
const [{ input, output, error }, { setInput, setOutput, setError, handleClear }] = useToolState();
```

This provides:
- Standard state variables (`input`, `output`, `error`)
- Setter functions (`setInput`, `setOutput`, `setError`)
- Built-in `handleClear()` that resets all three states

### UI Scaffold Sequence

Tool pages follow this component structure:

1. `ToolHeader` - Title and description
2. `ToolCard` - Main container
3. `ToolToolbar` - Action buttons (Swap, Paste, Clear)
4. `ToolOptionsBar` - Configuration controls
5. `ToolStatusStack` - Alerts and validation messages
6. `ToolBody` - Input/output text areas or specialized UI
7. `ToolFootnote` - Additional info or metadata

### Example Tool Structure

```typescript
export default function MyTool() {
  // 1. State management
  const [{ input, output, error }, { setInput, setOutput, setError, handleClear }] = useToolState();
  const { readText } = useClipboard();

  // 2. Processing logic
  const process = useCallback((text: string) => {
    try {
      setOutput(transform(text));
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, [setOutput, setError]);

  // 3. Event handlers
  const handlePaste = useCallback(async () => {
    const text = await readText();
    if (text) process(text);
  }, [readText, process]);

  // 4. Render scaffold
  return (
    <ToolPage>
      <ToolHeader title="..." description="..." />
      <ToolCard>
        <ToolToolbar>{/* buttons */}</ToolToolbar>
        <ToolBody>{/* inputs/outputs */}</ToolBody>
      </ToolCard>
    </ToolPage>
  );
}
```
