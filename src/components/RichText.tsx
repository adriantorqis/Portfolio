import { parseBlocks } from "@/lib/rich-text";

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
        const m = part.match(/^\*\*([^*]+)\*\*$/);
        return m ? (
          <strong key={i} className="font-medium text-ink">
            {m[1]}
          </strong>
        ) : (
          part
        );
      })}
    </>
  );
}

export function RichText({ source, className = "" }: { source: string; className?: string }) {
  return (
    <div className={`space-y-5 leading-relaxed text-muted ${className}`}>
      {parseBlocks(source).map((block, i) => {
        if (block.kind === "heading") {
          return (
            <h3 key={i} className="eyebrow pt-4 text-ink">
              {block.text}
            </h3>
          );
        }
        if (block.kind === "list") {
          return (
            <ul key={i} className="space-y-2.5">
              {block.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        );
      })}
    </div>
  );
}
