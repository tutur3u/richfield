import { renderRichTextToHTML } from "@tuturuuu/editor";
import { describe, expect, test } from "vitest";
import {
  RICHFIELD_RICH_TEXT_STYLE_POLICY,
  parseRichfieldJSONContent,
  richfieldContentFromStoredValue,
} from "./richfield-rich-text";

describe("Richfield structured content", () => {
  test("loads legacy Markdown when no structured document exists", () => {
    expect(richfieldContentFromStoredValue(null, "**Richfield** story")).toMatchObject({
      type: "doc",
    });
  });

  test("sanitizes stored content with the Richfield style policy", () => {
    const content = parseRichfieldJSONContent({
      type: "doc",
      content: [
        {
          attrs: { textAlign: "center" },
          type: "paragraph",
          content: [{ type: "text", text: "Centered" }],
        },
        {
          attrs: {
            alt: "News image",
            src: "javascript:alert(1)",
          },
          type: "image",
        },
      ],
    });
    const html = renderRichTextToHTML(content, {
      stylePolicy: RICHFIELD_RICH_TEXT_STYLE_POLICY,
    });

    expect(html).toContain("text-align: center");
    expect(html).not.toContain("javascript:");
  });
});
