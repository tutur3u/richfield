import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { JointVentureSpread } from "@/app/_components/v2/joint-venture-spread";

describe("<JointVentureSpread>", () => {
  it("renders the eyebrow and masthead title", () => {
    render(<JointVentureSpread />);
    expect(screen.getByText(/joint venture/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /dory rich jsc\.?/i, level: 2 }),
    ).toBeInTheDocument();
  });

  it("renders the feature headline and body", () => {
    render(<JointVentureSpread />);
    expect(
      screen.getByRole("heading", { name: /a successful collaboration/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /bringing manufacturing, brand-building, and distribution under one roof/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/established 2024/i)).toBeInTheDocument();
  });

  it("renders the venture and partner logos", () => {
    render(<JointVentureSpread />);
    expect(screen.getByRole("img", { name: "Dory Rich" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "TCP Group" })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Richfield Group" }),
    ).toBeInTheDocument();
  });

  it("renders an outbound link to doryrich.com.vn", () => {
    render(<JointVentureSpread />);
    const link = screen.getByRole("link", { name: /doryrich/i });
    expect(link).toHaveAttribute("href", "https://doryrich.com.vn");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringMatching(/noopener/i));
  });
});
