type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

/**
 * Splits FAQ answer text into paragraphs and bullet lists. Lines starting with
 * `-` or `•` (after optional space) become list items; blank lines separate blocks.
 * Editors can paste the same format in Studio.
 */
function parseFaqAnswerBlocks(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) break;

    const trimmed = lines[i].trim();
    const listMatch = trimmed.match(/^[-•]\s+(.+)$/);
    if (listMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = t.match(/^[-•]\s+(.+)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const paraChunks: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break;
      if (/^[-•]\s+/.test(t)) break;
      paraChunks.push(lines[i].trimEnd());
      i++;
    }
    const text = paraChunks.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
  }

  return blocks;
}

export function FaqAnswerBody({ text }: { text: string }) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const blocks = parseFaqAnswerBlocks(trimmed);
  if (blocks.length === 0) {
    return (
      <p className="whitespace-pre-wrap wrap-anywhere">{trimmed}</p>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) =>
        block.type === "p" ? (
          <p
            key={index}
            className="whitespace-pre-wrap wrap-anywhere last:mb-0"
          >
            {block.text}
          </p>
        ) : (
          <ul
            key={index}
            className="list-disc space-y-1.5 pl-5 text-inherit marker:text-gtp-teal"
          >
            {block.items.map((item, j) => (
              <li key={j} className="wrap-anywhere pl-0.5">
                {item}
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
