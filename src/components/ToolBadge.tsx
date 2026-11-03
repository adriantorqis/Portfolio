import type { Tool } from "@/lib/types";

// Icon + name. Falls back to a monogram tile when no icon file exists, so a
// tool listed before its logo is added still looks intentional.
export function ToolIcon({ tool, size = 44 }: { tool: Tool; size?: number }) {
  if (tool.icon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- tiny local SVG/PNG logo; next/image adds nothing here
      <img
        src={tool.icon}
        alt=""
        width={size}
        height={size}
        className="object-contain"
        style={{ width: size, height: size }}
        draggable={false}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="display flex items-center justify-center rounded-[22%] text-bg"
      style={{
        width: size,
        height: size,
        fontSize: size * ((tool.abbr ?? "").length > 2 ? 0.3 : 0.42),
        background: tool.color ?? "var(--color-ink)",
      }}
    >
      {tool.abbr ?? tool.name.slice(0, 2)}
    </span>
  );
}

export function ToolChip({ tool }: { tool: Tool }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line py-1 pl-1.5 pr-3 text-xs text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface">
        <ToolIcon tool={tool} size={14} />
      </span>
      {tool.name}
    </span>
  );
}
