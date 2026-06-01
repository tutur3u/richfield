import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FootPrintSpread } from "@/app/_components/v2/footprint-spread";

describe("<FootPrintSpread>", () => {
  it("renders the FOOTPRINT eyebrow", () => {
    render(<FootPrintSpread />);
    expect(screen.getByText(/^footprint$/i)).toBeInTheDocument();
  });

  it("renders the 'Three countries / generations / One promise' headline", () => {
    const { container } = render(<FootPrintSpread />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toMatch(
      /three countries\.\s*three generations\.\s*one promise\./i,
    );
  });

  it("emphasises 'generations' in italic gold", () => {
    const { container } = render(<FootPrintSpread />);
    const em = Array.from(container.querySelectorAll("em")).find(
      (e) => e.textContent?.trim().toLowerCase() === "generations",
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

  it("renders the three group offices with their roles", () => {
    render(<FootPrintSpread />);
    const offices = screen.getByRole("img", { name: /operating footprint/i });
    expect(offices).toBeInTheDocument();
    expect(screen.getByText("Vietnam")).toBeInTheDocument();
    expect(screen.getByText("Malaysia")).toBeInTheDocument();
    expect(screen.getByText("China")).toBeInTheDocument();
    expect(screen.getByText(/HQ · HCMC/i)).toBeInTheDocument();
    expect(screen.getByText(/origin · 1990s/i)).toBeInTheDocument();
    expect(screen.getByText(/sourcing & brands/i)).toBeInTheDocument();
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
