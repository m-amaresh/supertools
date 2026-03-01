# Technical Reference

## Quality Gates

Run before release:

```bash
pnpm -s exec biome check src/app src/components src/hooks src/lib next.config.ts
pnpm -s test:run
pnpm -s exec tsc --noEmit
pnpm -s build
```

## Security and Privacy Baseline

- CSP and security headers are configured via `next.config.ts`.
- Tool payload processing remains local to browser execution.
- Do not log sensitive payload content in analytics events.
- Avoid untrusted HTML rendering (`dangerouslySetInnerHTML`, `innerHTML` assignment).

### GitHub Security Automation

- **CodeQL** runs via `.github/workflows/codeql.yml` on push/PR/schedule/manual dispatch.
- **Dependency review** runs via `.github/workflows/dependency-review.yml` on pull requests to block newly introduced vulnerable dependencies (`high` severity threshold).
- **Dependabot** config is in `.github/dependabot.yml` for weekly npm dependency update PRs.

## Performance Expectations

- Keep tool interactions responsive for typical inputs.
- Guard large inputs and file sizes with clear warnings.
- Use bounded compute for expensive operations (for example line limits and worker timeouts).

## Tool Development Best Practices

### State Management

**Use `useToolState` for standard input/output/error patterns:**

```typescript
import { useToolState } from "@/hooks/useToolState";

// Provides: input, output, error + setters + handleClear
const [{ input, output, error }, { setInput, setOutput, setError, handleClear }] = useToolState();
```

**When NOT to use `useToolState`:**
- Tools with multiple inputs (e.g., diff has `left`/`right`)
- Generators without input (e.g., UUID, Password)
- Tools with complex state (e.g., RSA with key/message/signature)

### Shared Utilities

**Import encoding options from constants:**

```typescript
import { TEXT_ENCODING_OPTIONS } from "@/lib/constants";

<ToolbarSelect options={TEXT_ENCODING_OPTIONS} />
```

Note: `ToolbarSelect` accepts readonly arrays, so you can pass `TEXT_ENCODING_OPTIONS` directly without spreading.

**Use integer parsing utility:**

```typescript
import { parseStrictPositiveInt } from "@/lib/utils";

const count = parseStrictPositiveInt(userInput);
if (count === null) {
  // Handle invalid input
}
```

### Hook Dependencies

When using setters from `useToolState` in `useCallback` or `useEffect`, include them in dependency arrays:

```typescript
const process = useCallback((text: string) => {
  setOutput(transform(text));
  setError(null);
}, [setOutput, setError]); // ✅ Include setters
```

### Error State Management

**When to use `useToolState` error:**
- Simple, single error messages (e.g., "Invalid input", "Processing failed")
- Tools with straightforward validation (URL encoder, case converter, timestamp)
- General transformation errors

**When to use separate error state:**
- Complex error structures with nested information (e.g., JSON with line/column)
- Multiple error types that need different handling (e.g., YAML parsing vs. conversion errors)
- Tools with validation warnings alongside errors (e.g., Diff with line count warnings)

**Example - Simple error (use hook):**
```typescript
const [{ input, output, error }, { setError }] = useToolState();

try {
  setOutput(transform(input));
  setError(null);
} catch (e) {
  setError(e.message); // ✅ Single error string
}
```

**Example - Complex error (separate state):**
```typescript
const [{ input, output }, { setInput, setOutput }] = useToolState();
const [validationError, setValidationError] = useState<{
  message: string;
  line?: number;
  column?: number;
} | null>(null);

// ✅ Complex error structure with position info
```

## Vercel Deployment Notes

- Static assets and `/_next/static/*` are served from Vercel CDN.
- Local fonts via `next/font/local` are emitted as hashed static assets and cache well.
- Optional telemetry is integrated via:
  - `@vercel/analytics`
  - `@vercel/speed-insights`

## SEO Architecture

- Shared metadata builder: `src/lib/seo.ts` (`buildToolMetadata`).
- Route-specific intent keywords and FAQ content: `src/lib/tool-seo.ts`.
- FAQ rendering + schema:
  - `src/components/SeoFaq.tsx` for visible FAQ block + `FAQPage` JSON-LD.
  - `src/components/ToolSeoFaqServer.tsx` for route-driven FAQ rendering in tool layouts.
