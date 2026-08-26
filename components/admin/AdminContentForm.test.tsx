import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
import { ContentForm } from "./AdminContentForm";

const messages = {
  admin: {
    form: {
      close: "Close",
      created: "Created",
      dragAdd: "Drag or click to add",
      dragReplace: "Drag or click to replace",
      editImage: "Edit image",
      fields: {
        imageDescription: "Image description",
        title: "Title",
      },
      image: "Image",
      imageDetails: "Image details",
      imageDetailsHelp: "Make this image easy to find.",
      imageFile: "Image file",
      imageHelp: "Choose a clear picture.",
      imageLimit: "WebP · up to 12MB",
      itemNames: { "image-library": "image" },
      new: "New",
      noImage: "No image yet.",
      optimizing: "Optimizing…",
      placeholders: {
        galleryTitle: "AMOS campaign banner",
        imageDescription: "Describe this image",
      },
      removeConfirm: "Remove {title}?",
      removeImage: "Remove image",
      replaceImage: "Replace image",
      save: "Save",
      statuses: { published: "Published" },
      untitledItem: "Untitled {item}",
      updated: "Last updated",
    },
  },
};

const galleryItem = {
  createdAt: "2026-08-26T09:03:00.000Z",
  id: "gallery-1",
  imageAlt: "Peelerz product campaign",
  imageUrl: "/peelerz.webp",
  localeStatuses: { en: "published", vi: "draft" },
  slug: "amos-banner",
  status: "published",
  title: "AMOS banner",
  updatedAt: "2026-08-26T10:03:00.000Z",
} as RichfieldAdminContentItem;

describe("ContentForm gallery editor", () => {
  it("makes the gallery title and image description editable", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ContentForm
          collectionKey="image-library"
          item={galleryItem}
          onBusyChange={vi.fn()}
          onClose={vi.fn()}
          onCloseRequest={vi.fn()}
          onDeleted={vi.fn()}
          onDirtyChange={vi.fn()}
          onSaved={vi.fn()}
        />
      </NextIntlClientProvider>,
    );

    const title = screen.getByRole("textbox", { name: "Title" });
    expect(title).toHaveValue("AMOS banner");
    expect(
      screen.getByRole("textbox", { name: "Image description" }),
    ).toHaveValue("Peelerz product campaign");

    fireEvent.change(title, { target: { value: "Peelerz campaign banner" } });

    expect(title).toHaveValue("Peelerz campaign banner");
    expect(
      screen.getByRole("heading", { name: "Peelerz campaign banner" }),
    ).toBeInTheDocument();
  });
});
