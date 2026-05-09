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
        className="block h-3 w-3 rounded-full bg-gold ring-2 ring-ink"
      />
      <div className="font-display text-[42px] leading-none text-gold">
        {milestone.year}
      </div>
      <div className="font-medium text-paper">
        {milestone.brand} <span className="text-paper/60">·</span>{" "}
        <span className="text-paper/80">{milestone.country}</span>
      </div>
      <p
        className={
          variant === "detail"
            ? "max-w-[28ch] text-[15px] leading-[1.55] text-paper/70"
            : "max-w-[24ch] text-[14px] leading-[1.5] text-paper/70"
        }
      >
        {milestone.body}
      </p>
    </article>
  );
}
