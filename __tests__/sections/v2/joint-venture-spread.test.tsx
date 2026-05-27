import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JointVentureSpread } from "@/app/_components/v2/joint-venture-spread";

describe("<JointVentureSpread>", () => {
  it("renders the eyebrow and italic headline", () => {
    render(<JointVentureSpread />);
    expect(
      screen.getByText(/story 05 · the joint venture/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/dory rich\.\s+where distribution becomes manufacturing/i),
    ).toBeInTheDocument();
  });

  it("renders the body that names the 2024 JV with TCP", () => {
    render(<JointVentureSpread />);
    expect(
      screen.getByText(/in 2024, richfield and tcp formed dory rich jsc/i),
    ).toBeInTheDocument();
  });

  it("renders an outbound link to doryrich.com.vn", () => {
    render(<JointVentureSpread />);
    const link = screen.getByRole("link", { name: /doryrich/i });
    expect(link).toHaveAttribute("href", "https://doryrich.com.vn");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringMatching(/noopener/i));
  });

  it("renders the Dory Rich logo", () => {
    render(<JointVentureSpread />);
    // The figure photo also mentions Dory Rich in its alt text, so use exact
    // alt match to pin to the logo specifically.
    expect(screen.getByRole("img", { name: "Dory Rich" })).toBeInTheDocument();
  });
});
