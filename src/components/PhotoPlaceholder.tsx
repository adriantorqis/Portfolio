export function PhotoPlaceholder({
  className,
  label = "Photo",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`placeholder-fill flex items-center justify-center border border-line ${className ?? ""}`}
    >
      <span className="eyebrow bg-bg/80 px-2 py-1">{label}</span>
    </div>
  );
}
