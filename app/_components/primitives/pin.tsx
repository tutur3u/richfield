export function Pin({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`relative inline-flex h-3 w-3 ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-gold/50"
      />
      <span
        aria-hidden
        className="relative inline-flex h-full w-full rounded-full bg-gold ring-2 ring-cream"
      />
    </span>
  );
}
