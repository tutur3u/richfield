import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";

describe("<DisplayHeading>", () => {
  it("renders plain text without italic spans", () => {
    render(<DisplayHeading level={1}>Plain heading</DisplayHeading>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Plain heading",
    );
    expect(screen.queryByText("Plain heading")?.querySelector("em")).toBeNull();
  });

  it("wraps *segments* in italic <em> tags", () => {
    render(
      <DisplayHeading level={1}>From market entry to *nationwide distribution*.</DisplayHeading>,
    );
    const heading = screen.getByRole("heading", { level: 1 });
    const em = heading.querySelector("em");
    expect(em).not.toBeNull();
    expect(em).toHaveTextContent("nationwide distribution");
  });

  it("supports multiple italic segments", () => {
    render(
      <DisplayHeading level={2}>
        *Trusted* by the world's most *loved* brands.
      </DisplayHeading>,
    );
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.querySelectorAll("em")).toHaveLength(2);
  });
});
