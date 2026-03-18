interface RegexMatch {
  fullMatch: string;
  index: number;
  length: number;
  groups: string[];
  namedGroups: Record<string, string>;
}

interface RegexResult {
  matches: RegexMatch[];
  error: string | null;
}

interface WorkerPayload {
  pattern: string;
  flags: string;
  testString: string;
}

function isWorkerPayload(value: unknown): value is WorkerPayload {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.pattern === "string" &&
    typeof record.flags === "string" &&
    typeof record.testString === "string"
  );
}

self.onmessage = (event: MessageEvent<WorkerPayload>) => {
  // Ignore cross-origin messages if origin is present (dedicated workers may use an empty string).
  if (event.origin && event.origin !== self.location.origin) {
    return;
  }

  if (!isWorkerPayload(event.data)) {
    self.postMessage({
      matches: [],
      error: "Invalid request payload",
    } satisfies RegexResult);
    return;
  }

  const { pattern, flags, testString } = event.data;

  if (!pattern) {
    self.postMessage({ matches: [], error: null } satisfies RegexResult);
    return;
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];

    if (flags.includes("g")) {
      let match = regex.exec(testString);
      let safety = 0;
      while (match !== null && safety < 10000) {
        safety++;
        matches.push({
          fullMatch: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1).map((group) => (group == null ? "" : group)),
          namedGroups: match.groups ? { ...match.groups } : {},
        });

        if (match[0].length === 0) {
          regex.lastIndex++;
        }
        match = regex.exec(testString);
      }
    } else {
      const match = regex.exec(testString);
      if (match) {
        matches.push({
          fullMatch: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1).map((group) => (group == null ? "" : group)),
          namedGroups: match.groups ? { ...match.groups } : {},
        });
      }
    }

    self.postMessage({ matches, error: null } satisfies RegexResult);
  } catch (error) {
    self.postMessage({
      matches: [],
      error:
        error instanceof Error ? error.message : "Invalid regular expression",
    } satisfies RegexResult);
  }
};
