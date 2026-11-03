// Tiny markup for long-form content in the JSON files, so a project or
// experience write-up can have structure without a CMS:
//   ## Heading          — a block starting with "## "
//   - item              — a block whose lines all start with "- "
//   **bold**            — inline emphasis
// Blocks are separated by a blank line ("\n\n").

export type Block =
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "paragraph"; text: string };

export function parseBlocks(source: string): Block[] {
  return source
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((block): Block => {
      if (block.startsWith("## ")) return { kind: "heading", text: block.slice(3).trim() };
      const lines = block.split("\n").map((l) => l.trim());
      if (lines.every((l) => l.startsWith("- "))) {
        return { kind: "list", items: lines.map((l) => l.slice(2).trim()) };
      }
      return { kind: "paragraph", text: block };
    });
}

// First paragraph with markup removed — what a card shows as its teaser.
export function plainSummary(source: string): string {
  const first = parseBlocks(source).find((b) => b.kind === "paragraph");
  return first && first.kind === "paragraph" ? first.text.replace(/\*\*/g, "") : "";
}
