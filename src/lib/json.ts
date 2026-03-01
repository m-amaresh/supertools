export interface JsonValidationResult {
  valid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  parsed?: unknown;
}

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
