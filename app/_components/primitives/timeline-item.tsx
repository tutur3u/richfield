import type { Milestone } from "@/content/en/milestones";

type Variant = "compact" | "detail";

export function TimelineItem({
  milestone,
  variant = "compact",
}: {
  milestone: Milestone;
  variant?: Variant;
}) {
  return (
    <article className="flex flex-col gap-3 px-4">
      <span
        aria-hidden="true"
        className="block h-3 w-3 rounded-full bg-gold ring-2 ring-cream"
      />
      <div className="font-display text-[42px] leading-none text-gold">
        {milestone.year}
      </div>
      <div className="font-medium text-ink">
        {milestone.brand} <span className="text-muted">·</span>{" "}
        <span className="text-muted">{milestone.country}</span>
      </div>
      <p
        className={
          variant === "detail"
            ? "max-w-[28ch] text-[15px] leading-[1.55] text-muted"
            : "max-w-[24ch] text-[14px] leading-[1.5] text-muted"
        }
      >
        {milestone.body}
      </p>
    </article>
  );
}
