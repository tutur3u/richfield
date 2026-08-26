// @vitest-environment jsdom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TurnstileWidget } from "@/app/_components/forms/turnstile-widget";

vi.mock("next/script", () => ({
  default: ({ src }: { src: string }) => (
    <script async data-testid="turnstile-script" src={src} />
  ),
}));

describe("TurnstileWidget", () => {
  it("renders a visible, responsive, theme-aware managed widget", () => {
    const { container } = render(<TurnstileWidget siteKey="test-site-key" />);
    const widget = container.querySelector(".cf-turnstile");

    expect(document.querySelector('[data-testid="turnstile-script"]')).toHaveAttribute(
      "src",
      "https://challenges.cloudflare.com/turnstile/v0/api.js",
    );
    expect(widget).toHaveAttribute("data-appearance", "always");
    expect(widget).toHaveAttribute("data-size", "flexible");
    expect(widget).toHaveAttribute("data-theme", "auto");
    expect(widget).toHaveAttribute("data-action", "turnstile-spin-v2");
  });

  it("renders nothing when the site key is unavailable", () => {
    const { container } = render(<TurnstileWidget />);
    expect(container).toBeEmptyDOMElement();
  });
});
