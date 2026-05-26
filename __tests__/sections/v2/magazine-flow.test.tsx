import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MagazineFlow, MagazineFlowSection } from "@/app/_components/v2/magazine-flow";

// motion/react reads matchMedia for prefers-reduced-motion. Default jsdom
// matchMedia returns false (no matches), which means motion is enabled.
// We override per-test where we want the reduced-motion fallback path.
function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("prefers-reduced-motion") ? matches : false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("<MagazineFlow>", () => {
  it("renders each section's children", () => {
    mockReducedMotion(false);
    render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>Section A content</p>
        </MagazineFlowSection>
        <MagazineFlowSection bg="oklch(0.22 0.015 158)" textOnDark>
          <p>Section B content</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    expect(screen.getByText("Section A content")).toBeInTheDocument();
    expect(screen.getByText("Section B content")).toBeInTheDocument();
  });

  it("paints a fixed background layer when motion is enabled", () => {
    mockReducedMotion(false);
    const { container } = render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>A</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    const bgLayer = container.querySelector('[data-testid="magazine-flow-bg"]');
    expect(bgLayer).not.toBeNull();
  });

  it("under reduced motion, each section paints its own solid bg (no fixed layer)", () => {
    mockReducedMotion(true);
    const { container } = render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>A</p>
        </MagazineFlowSection>
        <MagazineFlowSection bg="oklch(0.22 0.015 158)" textOnDark>
          <p>B</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    expect(container.querySelector('[data-testid="magazine-flow-bg"]')).toBeNull();
    const sections = container.querySelectorAll("section");
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveStyle({ background: "oklch(0.96 0.018 82)" });
    expect(sections[1]).toHaveStyle({ background: "oklch(0.22 0.015 158)" });
  });

  it("applies cream type by default and ink type when textOnDark is set", () => {
    mockReducedMotion(true);
    const { container } = render(
      <MagazineFlow>
        <MagazineFlowSection bg="oklch(0.96 0.018 82)">
          <p>cream-bg</p>
        </MagazineFlowSection>
        <MagazineFlowSection bg="oklch(0.22 0.015 158)" textOnDark>
          <p>ink-bg</p>
        </MagazineFlowSection>
      </MagazineFlow>,
    );
    const sections = container.querySelectorAll("section");
    expect(sections[0].className).toContain("text-ink");
    expect(sections[1].className).toContain("text-cream");
  });
});
