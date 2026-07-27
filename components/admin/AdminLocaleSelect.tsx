"use client";

import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminLocaleSelect({
  englishLabel,
  label,
  locale,
  nextPath,
  vietnameseLabel,
}: {
  englishLabel: string;
  label: string;
  locale: string;
  nextPath: string;
  vietnameseLabel: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form action="/api/admin/locale" method="post" ref={formRef}>
      <input name="next" type="hidden" value={nextPath} />
      <input name="locale" type="hidden" value={locale} />
      <Select
        defaultValue={locale}
        onValueChange={(value) => {
          const input = formRef.current?.elements.namedItem("locale");
          if (input instanceof HTMLInputElement) input.value = String(value);
          formRef.current?.requestSubmit();
        }}
      >
        <SelectTrigger
          aria-label={label}
          className="h-9 min-w-32 rounded-full border-admin-rule bg-admin-surface px-3 text-xs font-semibold text-admin-ink shadow-none hover:border-admin-gold dark:bg-admin-surface"
        >
          <SelectValue>
            {locale === "vi" ? vietnameseLabel : englishLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          align="end"
          alignItemWithTrigger={false}
          className="border border-admin-rule bg-admin-surface text-admin-ink"
        >
          <SelectGroup>
            <SelectItem value="en">{englishLabel}</SelectItem>
            <SelectItem value="vi">{vietnameseLabel}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </form>
  );
}
