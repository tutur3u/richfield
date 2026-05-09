import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandCell } from "@/app/_components/primitives/brand-cell";

describe("<BrandCell>", () => {
  it("renders typographic fallback when no logoSrc is provided", () => {
    render(<BrandCell name="Wei Long" country="China" />);
    expect(screen.getByText("Wei Long")).toBeInTheDocument();
    expect(screen.getByText("China")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders <img> when logoSrc is provided", () => {
    render(
      <BrandCell name="Mars" country="USA" logoSrc="/brands/mars.png" />,
    );
    const img = screen.getByRole("img", { name: "Mars" });
    expect(img).toBeInTheDocument();
  });

  it("renders the feature variant 2x1 with caption when feature is true", () => {
    render(
      <BrandCell
        name="Mars · Wrigley"
        country="USA"
        feature
        featureCaption="Founding partner · Since 1994"
      />,
    );
    expect(screen.getByText("Mars · Wrigley")).toBeInTheDocument();
    expect(
      screen.getByText("Founding partner · Since 1994"),
    ).toBeInTheDocument();
  });
});
