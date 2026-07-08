export const RICHFIELD_UPSTREAM_TIMEOUT_MS = 8_000;

export function withRichfieldTimeout(
  init: RequestInit = {},
  timeoutMs = RICHFIELD_UPSTREAM_TIMEOUT_MS,
): RequestInit {
  if (init.signal) {
    return init;
  }

  return {
    ...init,
    signal: AbortSignal.timeout(timeoutMs),
  };
}

export function fetchWithRichfieldTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs?: number,
) {
  return fetch(input, withRichfieldTimeout(init, timeoutMs));
}

export function isRichfieldTimeoutError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}
