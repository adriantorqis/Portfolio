// Parses `**word**` markers inside plain content strings into a blue
// highlight chip. Lets content/profile.json call out its own important
// words in the bio without a rich-text field or a component change every
// time which words matter changes.
export function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        const match = part.match(/^\*\*([^*]+)\*\*$/);
        if (!match) return part;
        return (
          <mark
            key={i}
            className="rounded-sm bg-[#2f6fed]/15 px-1.5 py-0.5 font-medium text-[#2549b0] not-italic"
          >
            {match[1]}
          </mark>
        );
      })}
    </>
  );
}
