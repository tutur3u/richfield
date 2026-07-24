import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/_components/root-chrome", () => ({
  BodyChrome: ({ children }: { children: ReactNode }) => children,
  fontVariables: "test-fonts",
}));

import SystemLayout from "@/app/(system)/layout";

describe("SystemLayout", () => {
  it("does not render localized public chrome without an intl provider", () => {
    const layout = SystemLayout({
      children: <main data-testid="system-content" />,
    }) as ReactElement<{
      children: ReactElement<{ children: ReactNode; footer?: ReactNode }>;
    }>;

    expect(layout.props.children.props.footer).toBeUndefined();
    expect(layout.props.children.props.children).toMatchObject({
      type: "main",
    });
  });
});
