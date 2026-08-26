export const DEFAULT_RICHFIELD_CONTACT_RECIPIENTS = ["contact@tuturuuu.com"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Accept the CMS's legacy single value as well as comma/newline-separated inboxes. */
export function parseContactRecipients(value: unknown): string[] {
  const candidates = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? [value]
      : [];

  return [
    ...new Set(
      candidates
        .flatMap((candidate) =>
          typeof candidate === "string" ? candidate.split(/[,;\n]/) : [],
        )
        .map((candidate) => candidate.trim().toLowerCase())
        .filter((candidate) => EMAIL_PATTERN.test(candidate)),
    ),
  ];
}

export function resolveContactRecipients(...values: unknown[]): [string, ...string[]] {
  for (const value of values) {
    const recipients = parseContactRecipients(value);
    if (recipients.length > 0) return recipients as [string, ...string[]];
  }

  return [...DEFAULT_RICHFIELD_CONTACT_RECIPIENTS];
}
