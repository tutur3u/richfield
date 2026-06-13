import type { ReactNode } from "react";

type MagazineFlowProps = {
  children: ReactNode;
};

// Plain vertical stack of spreads on native scroll. The page is one solid cream
// canvas (set on the page <main>), so there is no per-section background and no
// colour morph — each spread brings its own <section id> for anchor targets.
// The background morph and scroll-snap that used to live here were removed when
// the experience moved to a single cream background and page-based scrolling.
export function MagazineFlow({ children }: MagazineFlowProps) {
  return <div className="relative">{children}</div>;
}
