import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeadSpread } from "@/app/_components/magazine/spreads/lead-spread";

describe("<LeadSpread>", () => {
  it("renders the OUR STORY eyebrow", () => {
    render(<LeadSpread />);
    expect(screen.getByText(/^our story$/i)).toBeInTheDocument();
  });

  it("renders the Our Story headline", () => {
    const { container } = render(<LeadSpread />);
    const h1 = container.querySelector("h1");
    expect(h1?.textContent).toMatch(/from a single partnership/i);
  });

  it("renders the Our Story intro copy", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(
        /what began as a single partnership with mars wrigley in 1994/i,
      ),
    ).toBeInTheDocument();
  });

  it("does not surface the outdated network figures", () => {
    const { container } = render(<LeadSpread />);
    expect(container.textContent).not.toContain("600,000");
    expect(container.textContent).not.toContain("200 sub-distributors");
  });
});
