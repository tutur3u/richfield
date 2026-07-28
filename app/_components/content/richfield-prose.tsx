import {
  renderRichTextToHTML,
  type JSONContent,
} from "@tuturuuu/editor";
import {
  RICHFIELD_RICH_TEXT_STYLE_POLICY,
  richfieldContentFromStoredValue,
} from "@/lib/richfield-rich-text";

type RichfieldProseProps = {
  compact?: boolean;
  content: string;
  structuredContent?: JSONContent | null;
};

/**
 * One safe renderer for editor preview and published pages.
 *
 * The editor package sanitizes nodes, marks, URLs, images and branded styles
 * before emitting HTML. Legacy Markdown is decoded only when structured
 * content has not yet been saved.
 */
export function RichfieldProse({
  compact = false,
  content,
  structuredContent,
}: RichfieldProseProps) {
  const document =
    structuredContent ?? richfieldContentFromStoredValue(null, content);
  const html = renderRichTextToHTML(document, {
    stylePolicy: RICHFIELD_RICH_TEXT_STYLE_POLICY,
  });

  return (
    <div
      className="richfield-prose v2-size-body leading-relaxed text-ink/85"
      data-compact={compact || undefined}
      // Safe: renderRichTextToHTML allowlists nodes, attributes, URLs, and
      // Richfield's explicit color/alignment policy.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
