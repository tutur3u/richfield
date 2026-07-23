type RichfieldProseProps = {
  content: string;
};

function safeHref(value: string) {
  const href = value.trim();
  if (
    href.startsWith("/") ||
    href.startsWith("#") ||
    /^(https?:|mailto:|tel:)/i.test(href)
  ) {
    return href;
  }
  return null;
}

function inlineText(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeHref(link[2] ?? "");
      if (!href) return link[1];
      const external = /^https?:/i.test(href);
      return (
        <a
          className="text-gold-strong underline decoration-current/40 underline-offset-4 transition-colors hover:text-ink"
          href={href}
          key={`${part}-${index}`}
          rel={external ? "noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {link[1]}
        </a>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={`${part}-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

export function RichfieldProse({ content }: RichfieldProseProps) {
  const lines = content.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    const items = list;
    list = [];
    nodes.push(
      <ul className="list-disc space-y-2 pl-6" key={`list-${nodes.length}`}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>{inlineText(item)}</li>
        ))}
      </ul>,
    );
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^[-*]\s+/.test(line)) {
      list.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    flushList();
    if (!line) continue;

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 className="font-display text-2xl" key={`h3-${nodes.length}`}>
          {inlineText(line.slice(4))}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      nodes.push(
        <h2 className="font-display text-3xl" key={`h2-${nodes.length}`}>
          {inlineText(line.slice(3))}
        </h2>,
      );
    } else if (line.startsWith("# ")) {
      nodes.push(
        <h2 className="font-display text-4xl" key={`h1-${nodes.length}`}>
          {inlineText(line.slice(2))}
        </h2>,
      );
    } else {
      nodes.push(<p key={`p-${nodes.length}`}>{inlineText(line)}</p>);
    }
  }

  flushList();

  return (
    <div className="v2-size-body flex flex-col gap-6 leading-relaxed text-ink/85">
      {nodes}
    </div>
  );
}
