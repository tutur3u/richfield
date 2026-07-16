import { describe, it, expect } from "vitest";
import { render, screen } from "@/__tests__/test-utils";
import { FootPrintSpread } from "@/app/_components/magazine/spreads/footprint-spread";

describe("<FootPrintSpread>", () => {
  it("renders the FOOTPRINT eyebrow", () => {
    render(<FootPrintSpread />);
    expect(screen.getByText(/^footprint$/i)).toBeInTheDocument();
  });

  it("renders the '3 countries / 3 generations / 1 promise' headline", () => {
    const { container } = render(<FootPrintSpread />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toMatch(
      /3 countries\.\s*3\s*generations\.\s*1 promise\./i,
    );
  });

  it("emphasises 'promise' in italic gold", () => {
    const { container } = render(<FootPrintSpread />);
    const em = Array.from(container.querySelectorAll("em")).find(
      (e) => e.textContent?.trim().toLowerCase() === "promise",
    );
    expect(em).toBeDefined();
    expect(em?.className).toMatch(/gold/i);
  });

  it("renders the client body copy without an em dash", () => {
    const { container } = render(<FootPrintSpread />);
    expect(
      screen.getByText(/spans three countries and three generations/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/international scale with hands-on knowledge/i),
    ).toBeInTheDocument();
    // No em dash anywhere in the spread copy.
    expect(container.textContent).not.toContain("—");
  });

  it("renders the client footprint map with descriptive alt text", () => {
    render(<FootPrintSpread />);
    const map = screen.getByRole("img", { name: /operating footprint/i });
    expect(map.getAttribute("alt")).toMatch(/china/i);
    expect(map.getAttribute("alt")).toMatch(/vietnam/i);
    expect(map.getAttribute("alt")).toMatch(/malaysia/i);
  });

  it("does not surface the old leading-bar STORY 03 eyebrow", () => {
    render(<FootPrintSpread />);
    expect(screen.queryByText(/story 03 .{0,3} the footprint/i)).toBeNull();
    expect(screen.queryByText(/issue 30/i)).toBeNull();
  });
});
