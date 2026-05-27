import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FieldAtlasSpread } from "@/app/_components/v2/field-atlas-spread";

describe("<FieldAtlasSpread>", () => {
  it("renders the eyebrow and headline", () => {
    render(<FieldAtlasSpread />);
    expect(screen.getByText(/story 03 · the footprint/i)).toBeInTheDocument();
    expect(screen.getByText(/international group/i)).toBeInTheDocument();
  });

  it("renders the word 'three' twice in the headline as <em> with gold accent class", () => {
    const { container } = render(<FieldAtlasSpread />);
    const ems = Array.from(container.querySelectorAll("em")).filter(
      (e) => e.textContent?.trim().toLowerCase() === "three",
    );
    expect(ems).toHaveLength(2);
    for (const em of ems) {
      expect(em.className).toMatch(/gold/i);
    }
  });

  it("renders the three country labels with their headcounts", () => {
    render(<FieldAtlasSpread />);
    expect(screen.getAllByText("Vietnam").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Cambodia").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Myanmar").length).toBeGreaterThan(0);
    expect(screen.getByText("1,820")).toBeInTheDocument();
    expect(screen.getByText("151")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("notes 'and growing' next to Vietnam", () => {
    render(<FieldAtlasSpread />);
    expect(screen.getByText(/and growing/i)).toBeInTheDocument();
  });

  it("does not render the deprecated 'Vietnam, Malaysia, and China together form one operating Group' sentence", () => {
    render(<FieldAtlasSpread />);
    expect(
      screen.queryByText(
        /vietnam, malaysia, and china together form one operating group/i,
      ),
    ).toBeNull();
  });

  it("does not surface stale country names from the earlier brief", () => {
    render(<FieldAtlasSpread />);
    expect(screen.queryByText("Malaysia")).toBeNull();
    expect(screen.queryByText("China")).toBeNull();
  });

  it("renders a map figure with the three pins as <ul>/<li> for accessibility", () => {
    render(<FieldAtlasSpread />);
    const list = screen.getByRole("list", { name: /offices/i });
    expect(list).toBeInTheDocument();
    expect(list.querySelectorAll("li")).toHaveLength(3);
  });
});
