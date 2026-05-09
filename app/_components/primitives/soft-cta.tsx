import Link from "next/link";

export function SoftCta({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls = `inline-flex min-h-[44px] items-center gap-2 py-2 text-[11px] font-medium uppercase tracking-[0.32em] text-gold underline decoration-gold decoration-[1px] underline-offset-[6px] transition-colors duration-200 hover:text-gold/80 ${className}`;
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {children} <span aria-hidden>→</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
}
