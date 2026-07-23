"use client";

import { useMemo, useRef, useState } from "react";

type RichTextEditorProps = {
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
};

const toolbar = [
  { after: "", before: "## ", label: "Heading" },
  { after: "**", before: "**", label: "Bold" },
  { after: "_", before: "_", label: "Italic" },
  { after: "", before: "- ", label: "List" },
  { after: "](https://)", before: "[", label: "Link" },
] as const;

function renderPreview(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/^#{1,3}\s+/, "").trim())
    .filter(Boolean);
}

export function RichTextEditor({
  disabled,
  label,
  onChange,
  value,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const wordCount = useMemo(
    () => value.trim().split(/\s+/).filter(Boolean).length,
    [value],
  );

  function apply(before: string, after: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    onChange(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length,
      );
    });
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
          {label}
        </span>
        <div className="flex items-center gap-1 text-xs text-[var(--ink-soft)]">
          <button
            className={mode === "write" ? "font-black text-[var(--navy)]" : ""}
            onClick={() => setMode("write")}
            type="button"
          >
            Write
          </button>
          <span aria-hidden="true">/</span>
          <button
            className={mode === "preview" ? "font-black text-[var(--navy)]" : ""}
            onClick={() => setMode("preview")}
            type="button"
          >
            Preview
          </button>
        </div>
      </div>
      <div className="overflow-hidden border border-[rgba(184,112,81,0.42)] bg-white">
        <div className="flex flex-wrap gap-1 border-b border-[rgba(184,112,81,0.25)] bg-[var(--parchment)] p-2">
          {toolbar.map((action) => (
            <button
              className="min-h-9 border border-transparent px-2 text-xs font-bold text-[var(--ink)] transition hover:border-[var(--gold)] hover:bg-white disabled:opacity-50"
              disabled={disabled}
              key={action.label}
              onClick={() => apply(action.before, action.after)}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
        {mode === "write" ? (
          <textarea
            className="min-h-72 w-full resize-y bg-transparent p-4 font-mono text-sm leading-7 text-[var(--ink)] outline-none"
            disabled={disabled}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder="Write the full story. Use headings, lists, links, and emphasis to make it easy to scan."
            ref={textareaRef}
            value={value}
          />
        ) : (
          <div className="grid min-h-72 content-start gap-4 p-5 text-sm leading-7 text-[var(--ink)]">
            {renderPreview(value).length > 0 ? (
              renderPreview(value).map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>{paragraph}</p>
              ))
            ) : (
              <p className="text-[var(--ink-soft)]">
                Start writing to see a visitor preview.
              </p>
            )}
          </div>
        )}
        <div className="border-t border-[rgba(184,112,81,0.25)] px-3 py-2 text-right text-xs text-[var(--ink-soft)]">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </div>
      </div>
    </div>
  );
}
