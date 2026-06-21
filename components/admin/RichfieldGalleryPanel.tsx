"use client";

import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
import {
  getRichfieldGalleryPageLabel,
  getRichfieldGalleryPlacementLabel,
  getRichfieldGalleryPlacementsForPage,
  richfieldGalleryPages,
  type RichfieldGalleryPageSection,
  type RichfieldGalleryPlacement,
} from "@/lib/richfield-gallery";
import { RICHFIELD_ADMIN_COPY } from "./richfield-admin-copy";

type GalleryPreset = {
  category?: string;
  pageSection: RichfieldGalleryPageSection;
  placement: RichfieldGalleryPlacement;
};

export function RichfieldGalleryPanel({
  items,
  onNew,
  onSelect,
  selectedId,
}: {
  items: RichfieldAdminContentItem[];
  onNew: (preset?: GalleryPreset) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <section className="grid min-w-0 content-start gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="script-label">Gallery</p>
          <h2 className="font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
            Site images
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
            Add images by the exact place they appear on the site.
          </p>
        </div>
        <button
          className={`min-h-11 w-full border px-4 text-sm font-bold transition sm:w-auto ${
            selectedId === null
              ? "border-[var(--gold)] bg-[var(--navy)] text-[var(--parchment)]"
              : "border-[rgba(184,112,81,0.48)] bg-white text-[var(--copper-dark)] hover:border-[var(--gold)]"
          }`}
          onClick={() => onNew()}
          type="button"
        >
          {RICHFIELD_ADMIN_COPY.actions.newImage}
        </button>
      </div>

      <div className="grid gap-5">
        {richfieldGalleryPages.map((page) => {
          const pageItems = items
            .filter((item) => item.pageSection === page.value)
            .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0));
          const placements = getRichfieldGalleryPlacementsForPage(page.value);

          return (
            <section
              className="grid gap-3 border border-[rgba(184,112,81,0.34)] bg-white p-4 shadow-[0_14px_40px_rgba(82,40,37,0.08)]"
              key={page.value}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-3xl leading-none text-[var(--navy)]">
                    {page.label}
                  </h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                    {pageItems.length} image{pageItems.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {placements.slice(0, 4).map((placement) => (
                    <button
                      className="min-h-9 border border-[rgba(184,112,81,0.42)] bg-[var(--parchment)] px-3 text-xs font-bold text-[var(--copper-dark)] transition hover:border-[var(--gold)]"
                      key={placement.value}
                      onClick={() =>
                        onNew({
                          pageSection: page.value,
                          placement: placement.value,
                        })
                      }
                      type="button"
                    >
                      Add {placement.label}
                    </button>
                  ))}
                </div>
              </div>

              {pageItems.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {pageItems.map((item) => (
                    <button
                      className={`grid min-w-0 gap-3 border bg-[var(--parchment)] p-3 text-left transition ${
                        selectedId === item.id
                          ? "border-[var(--gold)] shadow-[0_18px_46px_rgba(82,40,37,0.12)]"
                          : "border-[rgba(184,112,81,0.36)] hover:border-[var(--copper)]"
                      }`}
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      type="button"
                    >
                      <span
                        className={`relative block aspect-[4/3] overflow-hidden border border-[rgba(184,112,81,0.32)] bg-[rgba(239,207,178,0.55)] bg-cover bg-center ${
                          item.imageUrl ? "" : "grid place-items-center"
                        }`}
                        style={
                          item.imageUrl
                            ? { backgroundImage: `url(${JSON.stringify(item.imageUrl)})` }
                            : undefined
                        }
                      >
                        {item.imageUrl ? null : (
                          <span className="px-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                            No image
                          </span>
                        )}
                      </span>
                      <span className="grid min-w-0 gap-1">
                        <strong className="truncate text-sm text-[var(--ink)]">
                          {item.title}
                        </strong>
                        <span className="truncate text-xs text-[var(--ink-soft)]">
                          {getRichfieldGalleryPlacementLabel(item.placement)}
                          {item.category ? ` · ${item.category}` : ""}
                          {item.brand ? ` · ${item.brand}` : ""}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-[rgba(184,112,81,0.45)] bg-[var(--parchment)] p-4">
                  <p className="text-sm leading-6 text-[var(--ink-soft)]">
                    No images for {getRichfieldGalleryPageLabel(page.value)} yet.
                  </p>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}
