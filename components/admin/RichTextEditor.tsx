"use client";

import {
  jsonToMarkdown,
  type JSONContent,
  type RichTextFeaturePreset,
} from "@tuturuuu/editor";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { toast } from "sonner";
import {
  RICHFIELD_RICH_TEXT_STYLE_POLICY,
  richfieldContentFromStoredValue,
  serializeRichfieldJSONContent,
} from "@/lib/richfield-rich-text";
import { adminFetch } from "./richfield-admin-session-client";

const TuturuuuRichTextEditor = dynamic(
  () =>
    import("@tuturuuu/editor/react").then((module) => module.RichTextEditor),
  {
    loading: () => (
      <div
        aria-busy="true"
        className="admin-skeleton min-h-72 bg-admin-panel"
      />
    ),
    ssr: false,
  },
);

type RichTextEditorProps = {
  disabled?: boolean;
  enableHTMLSource?: boolean;
  enableImages?: boolean;
  featurePreset?: RichTextFeaturePreset;
  label: string;
  locale?: "en" | "vi";
  onChange: (markdown: string, structuredValue: string) => void;
  onSourceModeDirtyChange?: (dirty: boolean) => void;
  placeholder?: string;
  readOnly?: boolean;
  structuredValue?: string;
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
  enableHTMLSource = true,
  enableImages = false,
  featurePreset = "compact",
  label,
  locale = "en",
  onChange,
  onSourceModeDirtyChange,
  placeholder,
  readOnly = false,
  structuredValue = "",
  value,
}: RichTextEditorProps) {
  const t = useTranslations("admin.form");
  const content = useMemo(
    () => richfieldContentFromStoredValue(structuredValue, value),
    [structuredValue, value],
  );

  const handleChange = (nextContent: JSONContent | null) => {
    const markdown = jsonToMarkdown(nextContent);
    const nextStructuredValue = serializeRichfieldJSONContent(nextContent);
    if (markdown !== value || nextStructuredValue !== structuredValue) {
      onChange(markdown, nextStructuredValue);
    }
  };

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.set("file", file);
    const response = await adminFetch("/api/admin/editor-media", {
      body,
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      url?: string;
    } | null;

    if (!response.ok || !payload?.url) {
      throw new Error(payload?.error || "The image could not be uploaded.");
    }

    return payload.url;
  };

  return (
    <div className="grid gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--clay)]">
        {label}
      </span>
      <div
        aria-disabled={disabled || undefined}
        className="richfield-tuturuuu-editor overflow-visible rounded-xl border border-admin-rule-strong bg-admin-panel shadow-sm"
      >
        <TuturuuuRichTextEditor
          content={content}
          enableHTMLSource={enableHTMLSource && !readOnly}
          featurePreset={featurePreset}
          locale={locale}
          onChange={handleChange}
          onImageUpload={enableImages && !readOnly ? uploadImage : undefined}
          onImageUploadError={(error) =>
            toast.error(
              error instanceof Error
                ? error.message
                : t("inlineImageUploadError"),
            )
          }
          onSourceModeDirtyChange={onSourceModeDirtyChange}
          placeholder={placeholder}
          readOnly={disabled || readOnly}
          stylePolicy={RICHFIELD_RICH_TEXT_STYLE_POLICY}
        />
      </div>
    </div>
  );
}
