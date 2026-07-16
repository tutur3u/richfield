// Renders a string with *asterisk* spans emphasised — the same convention
// DisplayHeading already uses, extracted so dictionary strings (which carry
// their emphasis inline) can render anywhere.

export function parseItalics(
  text: string,
): Array<{ text: string; italic: boolean }> {
  const out: Array<{ text: string; italic: boolean }> = [];
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf("*", i);
    if (open === -1) {
      out.push({ text: text.slice(i), italic: false });
      break;
    }
    if (open > i) out.push({ text: text.slice(i, open), italic: false });
    const close = text.indexOf("*", open + 1);
    if (close === -1) {
      out.push({ text: text.slice(open), italic: false });
      break;
    }
    out.push({ text: text.slice(open + 1, close), italic: true });
    i = close + 1;
  }
  return out;
}

export function ItalicText({
  text,
  emClassName = "italic text-gold-strong",
}: {
  text: string;
  emClassName?: string;
}) {
  return (
    <>
      {parseItalics(text).map((s, idx) =>
        s.italic ? (
          <em key={idx} className={emClassName}>
            {s.text}
          </em>
        ) : (
          // Raw text node (not wrapped in a <span>): keeps the spaces around an
          // <em> in the element's accessible name, which per-node trimming of
          // wrapper elements would otherwise drop.
          s.text
        ),
      )}
    </>
  );
}
