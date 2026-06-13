import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Folio } from "@/app/_components/magazine/primitives/folio";
import { GraphicNumeral } from "@/app/_components/magazine/primitives/graphic-numeral";
import { PullQuote } from "@/app/_components/magazine/primitives/pull-quote";
import { SectionMarker } from "@/app/_components/magazine/primitives/section-marker";
import { Caption } from "@/app/_components/magazine/primitives/caption";

describe("<Folio>", () => {
  it("renders the number and label", () => {
    render(<Folio number="01" label="THE GROUP" />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("THE GROUP")).toBeInTheDocument();
  });

  it("right-aligns when asked", () => {
    const { container } = render(<Folio number="05" label="OUR BRANDS" align="right" />);
    expect(container.firstElementChild?.className).toMatch(/justify-end/);
  });
});

describe("<GraphicNumeral>", () => {
  it("renders its glyph at display scale, decorative", () => {
    const { container } = render(<GraphicNumeral>3</GraphicNumeral>);
    const el = screen.getByText("3");
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("aria-hidden");
    expect(el.className).toMatch(/text-\[clamp/);
    expect(container.textContent).toBe("3");
  });

  it("applies the gold gradient tone", () => {
    render(<GraphicNumeral tone="gold">62</GraphicNumeral>);
    expect(screen.getByText("62").className).toMatch(/bg-clip-text/);
  });
});

describe("<PullQuote>", () => {
  it("renders the quote in a blockquote", () => {
    const { container } = render(<PullQuote>Long-term value.</PullQuote>);
    const bq = container.querySelector("blockquote");
    expect(bq?.textContent).toMatch(/long-term value/i);
    expect(bq?.className).toMatch(/font-display/);
  });

  it("renders an optional citation", () => {
    render(<PullQuote cite="Richfield Group">A promise.</PullQuote>);
    expect(screen.getByText("Richfield Group")).toBeInTheDocument();
  });
});

describe("<SectionMarker>", () => {
  it("renders the circled number and label", () => {
    const { container } = render(<SectionMarker n="03" label="FOOTPRINT" />);
    expect(screen.getByText("03").className).toMatch(/rounded-full/);
    expect(screen.getByText("FOOTPRINT")).toBeInTheDocument();
  });
});

describe("<Caption>", () => {
  it("renders italic caption text", () => {
    const { container } = render(<Caption>Distribution centre · Long An</Caption>);
    expect(screen.getByText(/distribution centre/i).className).toMatch(/v2-italic/);
    expect(container.querySelector("figcaption")).toBeInTheDocument();
  });
});
