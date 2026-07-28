import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
import { AdminContentItemCard } from "./AdminContentItemCard";

const galleryItem = {
  category: "People",
  id: "gallery-1",
  imageAlt: "The Richfield team at an annual gathering",
  imageUrl: "/photos/people/richfield.webp",
  localeStatuses: { en: "published", vi: "draft" },
  pageSection: "About",
  placement: "Story",
  status: "published",
  title: "Annual team gathering",
} as RichfieldAdminContentItem;

describe("AdminContentItemCard", () => {
  it("renders Gallery items with their linked image, title, and placement", () => {
    const onOpen = vi.fn();

    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          admin: {
            common: {
              draft: "Draft",
              hidden: "Hidden",
              live: "Live",
              scheduled: "Scheduled",
              untitled: "Untitled",
            },
          },
        }}
      >
        <AdminContentItemCard
          collectionKey="image-library"
          item={galleryItem}
          onOpen={onOpen}
          selected={false}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/photos/people/richfield.webp",
    );
    expect(screen.getByText("Annual team gathering")).toBeInTheDocument();
    expect(screen.getByText("About · Story · People")).toBeInTheDocument();

    screen.getByRole("button").click();
    expect(onOpen).toHaveBeenCalledWith("gallery-1");
  });

  it("shows the linked cover image for editorial content", () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          admin: {
            common: {
              draft: "Draft",
              hidden: "Hidden",
              live: "Live",
              scheduled: "Scheduled",
              untitled: "Untitled",
            },
          },
        }}
      >
        <AdminContentItemCard
          collectionKey="articles"
          item={{
            ...galleryItem,
            id: "article-1",
            slug: "annual-team-gathering",
          }}
          onOpen={vi.fn()}
          selected={false}
        />
      </NextIntlClientProvider>,
    );

    expect(
      screen.getByRole("img", {
        name: "The Richfield team at an annual gathering",
      }),
    ).toHaveAttribute("src", "/photos/people/richfield.webp");
    expect(screen.getByText("/annual-team-gathering")).toBeInTheDocument();
  });
});
