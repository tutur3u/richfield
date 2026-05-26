import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DirectorySpread } from "@/app/_components/v2/directory-spread";

describe("<DirectorySpread>", () => {
  it("renders the section eyebrow and headline", () => {
    render(<DirectorySpread />);
    expect(screen.getByText(/story 04 · the directory/i)).toBeInTheDocument();
    expect(screen.getByText(/the brands we carry/i)).toBeInTheDocument();
  });

  it("renders all three category headings", () => {
    render(<DirectorySpread />);
    expect(screen.getByRole("heading", { name: /^food$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^beverages$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^non-food$/i })).toBeInTheDocument();
  });

  it("labels each band as 01 / 03, 02 / 03, 03 / 03", () => {
    render(<DirectorySpread />);
    expect(screen.getByText(/food · 01 \/ 03/i)).toBeInTheDocument();
    expect(screen.getByText(/beverages · 02 \/ 03/i)).toBeInTheDocument();
    expect(screen.getByText(/non-food · 03 \/ 03/i)).toBeInTheDocument();
  });

  it("renders Food category logos: Mars · Wrigley, Glico, NewChoice, AMOS, Wei Long", () => {
    render(<DirectorySpread />);
    const foodRegion = screen.getByRole("region", { name: /^food brands$/i });
    expect(foodRegion).toBeInTheDocument();
    for (const name of ["Mars · Wrigley", "Glico", "NewChoice", "AMOS", "Wei Long"]) {
      expect(foodRegion.querySelector(`img[alt="${name}"]`)).not.toBeNull();
    }
  });

  it("renders Beverages logos: Red Bull, Warrior", () => {
    render(<DirectorySpread />);
    const region = screen.getByRole("region", { name: /beverage brands/i });
    expect(region.querySelector('img[alt="Red Bull"]')).not.toBeNull();
    expect(region.querySelector('img[alt="Warrior"]')).not.toBeNull();
  });

  it("renders Non-Food logos: BiC, Caretex", () => {
    render(<DirectorySpread />);
    const region = screen.getByRole("region", { name: /non-food brands/i });
    expect(region.querySelector('img[alt="BiC"]')).not.toBeNull();
    expect(region.querySelector('img[alt="Caretex"]')).not.toBeNull();
  });

  it("does NOT render an Export band", () => {
    render(<DirectorySpread />);
    expect(screen.queryByRole("heading", { name: /^export$/i })).toBeNull();
  });

  it("renders a product marquee per category (3 total)", () => {
    render(<DirectorySpread />);
    expect(screen.getByRole("region", { name: /^food products$/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /^beverage products$/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /^non-food products$/i })).toBeInTheDocument();
  });
});
