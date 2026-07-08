"use client";

import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
import {
  getRichfieldGalleryPageLabel,
  getRichfieldGalleryPlacementLabel,
  richfieldGalleryPages,
} from "@/lib/richfield-gallery";

export function RichfieldGalleryPanel({
  items,
  onSelect,
  selectedId,
}: {
  items: RichfieldAdminContentItem[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <section className="grid min-w-0 content-start gap-5">
      <div className="min-w-0">
        <p className="script-label">Gallery</p>
        <h2 className="font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
          Site images
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-soft)]">
          Select an image to replace or remove it.
        </p>
      </div>

      <div className="grid gap-5">
        {richfieldGalleryPages.map((page) => {
          const pageItems = items
            .filter((item) => item.pageSection === page.value)
            .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0));

          return (
            <section
              className="grid gap-3 border border-[rgba(184,112,81,0.34)] bg-white p-4 shadow-[0_14px_40px_rgba(82,40,37,0.08)]"
              key={page.value}
            >
              <div>
                <h3 className="font-display text-3xl leading-none text-[var(--navy)]">
                  {page.label}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
                  {pageItems.length} image{pageItems.length === 1 ? "" : "s"}
                </p>
              </div>

              {pageItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                  {pageItems.map((item) => (
                    <button
                      className={`grid min-w-0 gap-2 border bg-[var(--parchment)] p-2 text-left transition ${
                        selectedId === item.id
                          ? "border-[var(--gold)] shadow-[0_14px_36px_rgba(82,40,37,0.12)]"
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
                          <span className="px-2 text-center text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[var(--ink-soft)]">
                            No image
                          </span>
                        )}
                      </span>
                      <span className="grid min-w-0 gap-0.5">
                        <strong className="truncate text-xs text-[var(--ink)]">
                          {item.title}
                        </strong>
                        <span className="truncate text-[0.7rem] text-[var(--ink-soft)]">
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
