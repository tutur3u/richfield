import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MagazineFlow } from "@/app/_components/magazine/chrome/magazine-flow";

// MagazineFlow is now a plain vertical wrapper: the page is one solid cream
// canvas, so there is no per-section background, colour morph, or scroll-snap.
// It simply renders its children (the spreads, each carrying its own section).
describe("<MagazineFlow>", () => {
  it("renders its children", () => {
    render(
      <MagazineFlow>
        <section>
          <p>Section A content</p>
        </section>
        <section>
          <p>Section B content</p>
        </section>
      </MagazineFlow>,
    );
    expect(screen.getByText("Section A content")).toBeInTheDocument();
    expect(screen.getByText("Section B content")).toBeInTheDocument();
  });

  it("does not paint a fixed background morph layer", () => {
    const { container } = render(
      <MagazineFlow>
        <section>
          <p>A</p>
        </section>
      </MagazineFlow>,
    );
    expect(
      container.querySelector('[data-testid="magazine-flow-bg"]'),
    ).toBeNull();
  });
});
