import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColophonSpread } from "@/app/_components/v2/colophon-spread";

describe("<ColophonSpread>", () => {
  it("renders 'Established' italic eyebrow and 1994 as the display climax", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/established/i)).toBeInTheDocument();
    const climax = screen.getByText(/^1994\.?$/);
    expect(climax).toBeInTheDocument();
    expect(climax.className).toMatch(/v2-size-cover/);
  });

  it("renders the three-country sub-line", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(/vietnam · malaysia · china · thirty years/i),
    ).toBeInTheDocument();
  });

  it("renders the office address from site.ts", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(/15a1 nguyễn hữu thọ/i),
    ).toBeInTheDocument();
  });

  it("renders office phone and hotline", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/3784 0237/)).toBeInTheDocument();
    expect(screen.getByText(/0917 331 132/)).toBeInTheDocument();
  });

  it("renders email and a Facebook link", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/cskh@richfieldvn\.com\.vn/i)).toBeInTheDocument();
    const fb = screen.getByRole("link", { name: /facebook/i });
    expect(fb).toHaveAttribute("href", "https://www.facebook.com/RichFieldGroup");
  });

  it("renders the colophon footer rule", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(
        /colophon · issue 30 — richfield worldwide jsc · 1994 — 2026 · next issue · 2031/i,
      ),
    ).toBeInTheDocument();
  });
});
