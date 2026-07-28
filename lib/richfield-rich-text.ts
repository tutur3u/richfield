import {
  markdownToJSON,
  sanitizeRichTextContent,
  type JSONContent,
  type RichTextStylePolicy,
} from "@tuturuuu/editor";

export const RICHFIELD_RICH_TEXT_STYLE_POLICY = {
  alignments: ["left", "center", "right"],
  highlights: [
    { label: "Warm gold", value: "#f4dfb4" },
    { label: "Soft blue", value: "#dceaf3" },
    { label: "Soft green", value: "#dcebdc" },
  ],
  textTones: [
    { label: "Navy", value: "#0c1f34" },
    { label: "Copper", value: "#a75435" },
    { label: "Teal", value: "#1f6b73" },
  ],
} satisfies RichTextStylePolicy;

export function parseRichfieldJSONContent(value: unknown): JSONContent | null {
  if (!value) return null;

  let candidate: unknown = value;
  if (typeof value === "string") {
    try {
      candidate = JSON.parse(value);
    } catch {
      return null;
    }
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return null;
  }

  return sanitizeRichTextContent(candidate as JSONContent, {
    stylePolicy: RICHFIELD_RICH_TEXT_STYLE_POLICY,
  });
}

export function richfieldContentFromStoredValue(
  structured: unknown,
  markdown: string,
) {
  return parseRichfieldJSONContent(structured) ?? markdownToJSON(markdown);
}

export function serializeRichfieldJSONContent(content: JSONContent | null) {
  return content ? JSON.stringify(content) : "";
}
