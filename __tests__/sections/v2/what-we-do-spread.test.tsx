import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatWeDoSpread } from "@/app/_components/v2/what-we-do-spread";

describe("<WhatWeDoSpread>", () => {
  it("renders the section eyebrow and italic headline", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText(/story 02 · what we do/i)).toBeInTheDocument();
    expect(
      screen.getByText(/three ways we move brands to market/i),
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

  it("renders 01 / 02 / 03 numerals", () => {
    render(<WhatWeDoSpread />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
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
    const stat = screen.getByText(/TWO DCS · LONG AN · HANOI/i);
    expect(stat).toBeInTheDocument();
  });
});
