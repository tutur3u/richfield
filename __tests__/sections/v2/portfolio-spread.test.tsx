import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { PortfolioSpread } from "@/app/_components/v2/portfolio-spread";

describe("<PortfolioSpread>", () => {
  it("renders the intro eyebrow and headline", () => {
    render(<PortfolioSpread />);
    expect(screen.getAllByText(/directory/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/recognized/i)).toBeInTheDocument();
  });

  it("renders the shelf headline and a category tablist", () => {
    render(<PortfolioSpread />);
    expect(screen.getByRole("heading", { name: /the full shelf/i })).toBeInTheDocument();
    const tablist = screen.getByRole("tablist", { name: /product categories/i });
    expect(within(tablist).getByRole("tab", { name: /^food/i })).toBeInTheDocument();
    expect(within(tablist).getByRole("tab", { name: /beverages/i })).toBeInTheDocument();
    expect(within(tablist).getByRole("tab", { name: /non-food/i })).toBeInTheDocument();
  });

  it("shows Food by default with its brand roster and product mosaic", () => {
    render(<PortfolioSpread />);
    const roster = screen.getByRole("region", { name: /^food brands$/i });
    for (const name of ["Mars · Wrigley", "Glico", "NewChoice", "AMOS", "Wei Long"]) {
      expect(roster.querySelector(`img[alt="${name}"]`)).not.toBeNull();
    }
    const mosaic = screen.getByRole("region", { name: /^food products$/i });
    expect(mosaic.querySelectorAll("img").length).toBeGreaterThan(0);
  });

  it("switches to Beverages and reveals Red Bull and Warrior", () => {
    render(<PortfolioSpread />);
    fireEvent.click(screen.getByRole("tab", { name: /beverages/i }));
    const roster = screen.getByRole("region", { name: /^beverages brands$/i });
    expect(roster.querySelector('img[alt="Red Bull"]')).not.toBeNull();
    expect(roster.querySelector('img[alt="Warrior"]')).not.toBeNull();
    expect(screen.getByRole("region", { name: /^beverages products$/i })).toBeInTheDocument();
    // Food panel is no longer mounted.
    expect(screen.queryByRole("region", { name: /^food products$/i })).toBeNull();
  });

  it("switches to Non-Food and reveals BiC and Caretex", () => {
    render(<PortfolioSpread />);
    fireEvent.click(screen.getByRole("tab", { name: /non-food/i }));
    const roster = screen.getByRole("region", { name: /^non-food brands$/i });
    expect(roster.querySelector('img[alt="BiC"]')).not.toBeNull();
    expect(roster.querySelector('img[alt="Caretex"]')).not.toBeNull();
  });

  it("does NOT render an Export band", () => {
    render(<PortfolioSpread />);
    expect(screen.queryByRole("heading", { name: /^export$/i })).toBeNull();
  });
});
