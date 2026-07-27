import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/_components/root-chrome", () => ({
  BodyChrome: ({ children }: { children: ReactNode }) => children,
  fontVariables: "test-fonts",
}));
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));

import SystemLayout from "@/app/(system)/layout";

describe("SystemLayout", () => {
  it("does not render localized public chrome without an intl provider", async () => {
    const layout = (await SystemLayout({
      children: <main data-testid="system-content" />,
    })) as ReactElement<{
      children: ReactElement<{
        children: ReactElement<{ children: ReactNode }>;
        footer?: ReactNode;
      }>;
    }>;

    // The point of this test: no localized footer, which would need the intl
    // provider these routes deliberately do not mount.
    expect(layout.props.children.props.footer).toBeUndefined();

    // The admin query provider now sits between the chrome and the page, so
    // the content is one level in rather than the chrome's direct child.
    const intlProvider = layout.props.children.props.children;
    const queryProvider = intlProvider.props.children as ReactElement<{
      children: ReactNode;
    }>;
    expect(queryProvider.props.children).toMatchObject({ type: "main" });
  });
});
