import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { LeadSpread } from "@/app/_components/magazine/spreads/lead-spread";
import { TimelineSpread } from "@/app/_components/magazine/spreads/timeline-spread";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "From a single partnership to a nationwide network — the founder's story and three decades of Richfield milestones.",
  alternates: { canonical: "/about/our-story" },
};

// Our Story — one cream movement: the narrative lead (which now folds the
// founder profile into its flow) and the timeline. The lead opens the page
// (head clears the running-head); the timeline sits flush beneath it.
export default function OurStoryPage() {
  return (
    <>
      <RunningHead />
      <main className="bg-cream text-ink">
        <LeadSpread head />
        <TimelineSpread />
      </main>
    </>
  );
}
