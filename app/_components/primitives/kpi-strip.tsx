export type Kpi = {
  label: string;
  value: string;
};

export function KpiStrip({
  items,
  tone = "on-green",
}: {
  items: Kpi[];
  tone?: "on-green" | "on-cream";
}) {
  const labelClass = tone === "on-green" ? "text-paper/60" : "text-muted";
  const valueClass = tone === "on-green" ? "text-paper" : "text-ink";
  return (
    <dl
      className={`grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0 sm:gap-x-8 ${tone === "on-green" ? "text-paper" : "text-ink"}`}
    >
      {items.map((kpi) => (
        <div key={kpi.label} className="flex flex-col gap-2">
          <dt
            className={`text-[11px] uppercase tracking-[0.32em] ${labelClass}`}
          >
            {kpi.label}
          </dt>
          <dd
            className={`font-display text-[32px] leading-none ${valueClass}`}
          >
            {kpi.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
