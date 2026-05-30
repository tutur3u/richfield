import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeadSpread } from "@/app/_components/v2/lead-spread";

describe("<LeadSpread>", () => {
  it("renders the about-the-group headline", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(/from market entry to nationwide distribution/i),
    ).toBeInTheDocument();
  });

  it("renders the updated by-the-numbers stats", () => {
    render(<LeadSpread />);
    expect(screen.getByText("180,000")).toBeInTheDocument();
    expect(screen.getByText("300+")).toBeInTheDocument();
    expect(screen.getByText("800+")).toBeInTheDocument();
    expect(screen.getByText("30+")).toBeInTheDocument();
  });

  it("does not render the outdated stats", () => {
    render(<LeadSpread />);
    expect(screen.queryByText("600,000")).toBeNull();
    expect(screen.queryByText("200+")).toBeNull();
    expect(screen.queryByText("1,000+")).toBeNull();
  });

  it("renders the by-the-numbers stat strip eyebrow", () => {
    render(<LeadSpread />);
    const matches = screen.getAllByText(/by the numbers/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders the brand-partners continuation paragraph", () => {
    render(<LeadSpread />);
    // The third client paragraph names Mars as a flagship brand partner.
    expect(screen.getByText(/leading brands such as mars/i)).toBeInTheDocument();
  });
});
