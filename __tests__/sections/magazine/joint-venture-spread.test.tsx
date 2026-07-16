import { describe, it, expect, vi } from "vitest";
import type { ComponentProps } from "react";
import { render, screen } from "@/__tests__/test-utils";

// The i18n navigation Link (via CtaLink) resolves next/navigation, which
// vitest's resolver can't load. These tests assert copy, not routing.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, locale: _locale, ...props }: ComponentProps<"a"> & { href: string; locale?: string }) => (
    <a href={typeof href === "string" ? href : "#"} {...props} />
  ),
  usePathname: () => "/",
}));

import { JointVentureSpread } from "@/app/_components/magazine/spreads/joint-venture-spread";

describe("<JointVentureSpread>", () => {
  it("renders the joint-venture eyebrow", () => {
    render(<JointVentureSpread />);
    expect(screen.getByText(/joint venture/i)).toBeInTheDocument();
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
