export interface JsonValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  parsed?: unknown;
}

// Parse JSON and extract error position as line/column from the character
// offset reported by the engine. V8 (Chrome/Edge/Node) includes "at position N"
// in the error message; Firefox and Safari use different formats so line/column
// will be undefined on those engines — callers must handle the absent case.
export function validateJson(input: string): JsonValidationResult {
  if (!input.trim()) {
    return { valid: true };
  }

  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch (e) {
    const error = e as SyntaxError;
    const match = error.message.match(/at position (\d+)/);
    const position = match ? parseInt(match[1], 10) : undefined;

    let line: number | undefined;
    let column: number | undefined;

    if (position !== undefined) {
      const lines = input.substring(0, position).split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      error: {
        message: error.message,
        line,
        column,
      },
    };
  }
}

export function shouldShowValidJsonStatus(args: {
  input: string;
  hasError: boolean;
  oversized: boolean;
}): boolean {
  return args.input.trim().length > 0 && !args.hasError && !args.oversized;
}

// Recursively sort object keys alphabetically. Arrays are traversed but
// their element order is preserved (only object keys within are sorted).
export function sortJsonKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortJsonKeys);
  }
  if (obj !== null && typeof obj === "object") {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortJsonKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return obj;
}
