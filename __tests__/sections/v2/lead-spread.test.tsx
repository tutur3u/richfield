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

  it("stat strip eyebrow says 'BY THE NUMBERS · VIETNAM' (Vietnam-only)", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(/by the numbers · vietnam/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/by the numbers · vietnam · malaysia/i),
    ).toBeNull();
  });

  it("renders the second paragraph with brand partner names", () => {
    render(<LeadSpread />);
    expect(
      screen.getByText(/mars, red bull, bic, glico, amos, and newchoice/i),
    ).toBeInTheDocument();
  });
});
