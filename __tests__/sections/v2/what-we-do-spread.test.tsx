import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatWeDoSpread } from "@/app/_components/v2/what-we-do-spread";

describe("<WhatWeDoSpread>", () => {
  it("renders the section eyebrow and italic headline", () => {
    render(<WhatWeDoSpread />);
    // Eyebrow was simplified during polish — no leading "STORY 02" prefix.
    expect(screen.getByText(/what we do/i)).toBeInTheDocument();
    // Headline splits the emphasised word into an <em>, so match the heading's
    // concatenated accessible name rather than a single text node.
    expect(
      screen.getByRole("heading", {
        name: /three ways we move brands to markets/i,
        level: 2,
      }),
    ).toBeInTheDocument();
  });

  it("renders all three capability cards (no Export)", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText("Warehouse & Logistics")).toBeInTheDocument();
    expect(screen.getByText("General Trade")).toBeInTheDocument();
    expect(screen.getByText("Modern Trade")).toBeInTheDocument();
    expect(screen.queryByText(/^export$/i)).toBeNull();
    expect(screen.queryByText(/import & export/i)).toBeNull();
  });

  it("renders each capability's signature stat line", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText(/TWO DCS/i)).toBeInTheDocument();
    expect(screen.getByText(/180,000 OUTLETS/i)).toBeInTheDocument();
    expect(screen.getByText(/EVERY CHAIN IN VIETNAM/i)).toBeInTheDocument();
  });

  it("renders the GT signature stat including 180,000 outlets", () => {
    render(<WhatWeDoSpread />);
    // The signature stat is a mono small-caps line. Scope to it so the body
    // paragraph's "180,000 retail outlets" prose doesn't collide.
    const matches = screen.getAllByText(/180,000 outlets/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    const stat = matches.find((el) => el.textContent?.toUpperCase().includes("800+ SALESMEN"));
    expect(stat).toBeDefined();
  });

  it("renders the Logistics signature stat naming both DCs", () => {
    render(<WhatWeDoSpread />);
    const stat = screen.getByText(/TWO DCS .{1,3} LONG AN .{1,3} HANOI/i);
    expect(stat).toBeInTheDocument();
  });
});
