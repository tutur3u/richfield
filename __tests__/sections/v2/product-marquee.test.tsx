import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductMarquee } from "@/app/_components/v2/product-marquee";

const SAMPLE = [
  { src: "/photos/products/a.webp", name: "Item A", alt: "Item A photo" },
  { src: "/photos/products/b.webp", name: "Item B", alt: "Item B photo" },
  { src: "/photos/products/c.webp", name: "Item C", alt: "Item C photo" },
];

describe("<ProductMarquee>", () => {
  it("renders an image for each item provided, with the alt as accessible name", () => {
    render(<ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />);
    expect(screen.getAllByRole("img", { name: "Item A photo" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("img", { name: "Item B photo" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("img", { name: "Item C photo" }).length).toBeGreaterThan(0);
  });

  it("renders item names as captions", () => {
    render(<ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />);
    expect(screen.getAllByText("Item A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Item B").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Item C").length).toBeGreaterThan(0);
  });

  it("applies the marquee animation class to the track", () => {
    const { container } = render(
      <ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />,
    );
    const track = container.querySelector('[data-testid="marquee-track"]');
    expect(track).not.toBeNull();
    expect(track?.className).toContain("marquee-track");
  });

  it("duplicates the item list inside the track so the loop is seamless", () => {
    const { container } = render(
      <ProductMarquee items={SAMPLE} ariaLabel="Sample marquee" />,
    );
    expect(container.querySelectorAll("img")).toHaveLength(SAMPLE.length * 2);
  });

  it("exposes the marquee as a labelled region", () => {
    render(<ProductMarquee items={SAMPLE} ariaLabel="Food products" />);
    expect(
      screen.getByRole("region", { name: /food products/i }),
    ).toBeInTheDocument();
  });
});
