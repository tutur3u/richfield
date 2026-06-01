import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VerticalTOC } from "@/app/_components/v2/vertical-toc";

describe("<VerticalTOC>", () => {
  it("renders six entries by default with the new labels", () => {
    render(<VerticalTOC />);
    expect(screen.getByText(/about us/i)).toBeInTheDocument();
    expect(screen.getByText(/what we do/i)).toBeInTheDocument();
    expect(screen.getByText(/footprint/i)).toBeInTheDocument();
    expect(screen.getByText(/portfolio/i)).toBeInTheDocument();
    expect(screen.getByText(/joint venture/i)).toBeInTheDocument();
    expect(screen.getByText(/colophon/i)).toBeInTheDocument();
  });

  it("uses the section-id anchors matching the new spread IDs", () => {
    render(<VerticalTOC />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual([
      "#lead",
      "#what",
      "#atlas",
      "#brands",
      "#jv",
      "#colophon",
    ]);
  });

  it("marks the currently-active entry with aria-current", () => {
    render(<VerticalTOC activeId="atlas" />);
    const active = screen.getByRole("link", { current: "location" });
    expect(active).toHaveAttribute("href", "#atlas");
  });
});
