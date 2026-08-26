import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, test } from "vitest";
import { EmailMultiSelectField } from "./AdminFormFields";

function RecipientEditor({ initialValue = "contact@tuturuuu.com" }) {
  const [value, setValue] = useState(initialValue);

  return (
    <EmailMultiSelectField
      addPlaceholder="Add another email address"
      invalidEmailMessage="Enter a valid email address."
      label="Recipient email(s)"
      name="email"
      onChange={(_name, nextValue) => setValue(nextValue)}
      removeRecipientLabel={(email) => `Remove ${email}`}
      value={value}
    />
  );
}

describe("EmailMultiSelectField", () => {
  test("adds, normalizes, deduplicates, and removes recipient chips", () => {
    render(<RecipientEditor />);
    const input = screen.getByPlaceholderText("Add another email address");

    fireEvent.change(input, {
      target: { value: "PARTNERS@RICHFIELD.TEST" },
    });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(screen.getByText("partners@richfield.test")).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: "partners@richfield.test" },
    });
    fireEvent.keyDown(input, { key: "," });
    expect(screen.getAllByText("partners@richfield.test")).toHaveLength(1);

    fireEvent.click(
      screen.getByRole("button", { name: "Remove contact@tuturuuu.com" }),
    );
    expect(screen.queryByText("contact@tuturuuu.com")).not.toBeInTheDocument();
  });

  test("keeps an invalid pending address visible and explains the problem", () => {
    render(<RecipientEditor initialValue="" />);
    const input = screen.getByPlaceholderText("Add another email address");

    fireEvent.change(input, { target: { value: "not-an-email" } });
    fireEvent.blur(input);

    expect(input).toHaveValue("not-an-email");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid email address.",
    );
  });
});
