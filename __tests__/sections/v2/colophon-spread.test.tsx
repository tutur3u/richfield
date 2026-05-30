import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ColophonSpread } from "@/app/_components/v2/colophon-spread";

describe("<ColophonSpread>", () => {
  it("renders the 'Established' eyebrow and the 1994—2026 lockup", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/established/i)).toBeInTheDocument();
    // Lockup combines 1994 + 2026 in a single upright display element.
    const lockup = screen.getByLabelText(/1994 to 2026/i);
    expect(lockup).toBeInTheDocument();
    expect(lockup.className).toMatch(/font-display/);
    expect(lockup.textContent).toMatch(/1994/);
    expect(lockup.textContent).toMatch(/2026/);
  });

  it("renders the three-country sub-line", () => {
    render(<ColophonSpread />);
    expect(
      screen.getByText(/vietnam .{1,3} cambodia .{1,3} myanmar/i),
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

  it("renders the 'next issue 2031' marker", () => {
    render(<ColophonSpread />);
    expect(screen.getByText(/next issue .{1,3} 2031/i)).toBeInTheDocument();
  });
});
