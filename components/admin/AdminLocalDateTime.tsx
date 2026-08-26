"use client";

import { useLocale } from "next-intl";

export function formatAdminLocalDateTime(
  value: string,
  locale: string,
  timeZone?: string,
) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    timeZone,
    timeZoneName: "shortOffset",
    year: "numeric",
  }).format(date);
}

export function AdminLocalDateTime({
  className,
  prefix,
  value,
}: {
  className?: string;
  prefix?: string;
  value: string | null | undefined;
}) {
  const locale = useLocale() === "vi" ? "vi-VN" : "en-US";

  if (!value) return null;

  const label = formatAdminLocalDateTime(value, locale);
  if (!label) return null;

  return (
    <time
      className={className}
      dateTime={value}
      suppressHydrationWarning
      title={label}
    >
      {prefix}
      {label}
    </time>
  );
}
