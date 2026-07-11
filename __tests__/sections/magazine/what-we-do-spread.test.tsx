import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatWeDoSpread } from "@/app/_components/magazine/spreads/what-we-do-spread";

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
    expect(screen.getByText(/Two Distribution Centers/i)).toBeInTheDocument();
    expect(screen.getByText(/180,000\+ POINTS/i)).toBeInTheDocument();
    expect(screen.getByText(/EVERY CHAIN IN VIETNAM/i)).toBeInTheDocument();
  });

  it("renders the GT signature stat naming sub-distributors", () => {
    render(<WhatWeDoSpread />);
    const stat = screen.getByText(/180,000\+ POINTS .{1,3} 300\+ SUB-DISTRIBUTORS/i);
    expect(stat).toBeInTheDocument();
  });

  it("renders the Logistics signature stat naming both DCs", () => {
    render(<WhatWeDoSpread />);
    const stat = screen.getByText(/Two Distribution Centers: Long An and Hanoi/i);
    expect(stat).toBeInTheDocument();
  });
});
