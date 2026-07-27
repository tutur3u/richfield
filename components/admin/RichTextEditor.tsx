"use client";

import {
  jsonToMarkdown,
  markdownToJSON,
  type JSONContent,
} from "@tuturuuu/editor";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const TuturuuuRichTextEditor = dynamic(
  () =>
    import("@tuturuuu/editor/react").then((module) => module.RichTextEditor),
  {
    loading: () => (
      <div
        aria-busy="true"
        className="min-h-72 animate-pulse bg-[rgba(239,207,178,0.28)]"
      />
    ),
    ssr: false,
  },
);

type RichTextEditorProps = {
  disabled?: boolean;
  label: string;
  locale?: "en" | "vi";
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

/**
 * Markdown-compatible adapter for the shared Tuturuuu structured editor.
 *
 * Existing Markdown is decoded into JSONContent for editing and serialized at
 * the current API boundary, so legacy blocks remain readable throughout the
 * structured-content migration.
 */
export function RichTextEditor({
  disabled,
  label,
  locale = "en",
  onChange,
  placeholder,
  value,
}: RichTextEditorProps) {
  const content = useMemo(() => markdownToJSON(value), [value]);

  const handleChange = (nextContent: JSONContent | null) => {
    const markdown = jsonToMarkdown(nextContent);
    if (markdown !== value) onChange(markdown);
  };

  return (
    <div className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
        {label}
      </span>
      <div
        aria-disabled={disabled || undefined}
        className="richfield-tuturuuu-editor overflow-hidden border border-[rgba(184,112,81,0.42)] bg-white"
      >
        <TuturuuuRichTextEditor
          content={content}
          locale={locale}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={disabled}
        />
      </div>
    </div>
  );
}
