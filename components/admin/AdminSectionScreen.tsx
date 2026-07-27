"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminSection } from "@/lib/admin/sections";
import { AdminContentList } from "./AdminContentList";

/**
 * The body of one dashboard section.
 *
 * Sections backed by a collection get the searchable, infinitely scrolling
 * list. The few that are not a list (files, people, account) say plainly where
 * that work happens rather than rendering an empty shell — a dead panel reads
 * as broken, a signpost does not.
 */
export function AdminSectionScreen({ section }: { section: AdminSection }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="grid min-w-0 gap-6">
      <header className="grid gap-1">
        <h1 className="font-display text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.05] tracking-[-0.015em] text-admin-navy">
          {section.title}
        </h1>
        <p className="max-w-[60ch] text-sm leading-6 text-admin-ink-soft">
          {section.description}
        </p>
      </header>

      {section.collectionKey ? (
        <>
          {/* Editing still lives in the original dashboard until the editor is
              lifted out of it. Say so plainly and link there, rather than
              opening a panel that cannot save. */}
          {selectedId !== null ? (
            <div
              className="flex flex-wrap items-center justify-between gap-3 border border-admin-rule bg-white/60 p-4"
              role="status"
            >
              <p className="text-sm text-admin-ink-soft">
                Editing opens in the full dashboard for now.
              </p>
              <div className="flex gap-2">
                <Link className="button-primary px-4" href="/admin">
                  Open editor
                </Link>
                <button
                  className="button-secondary px-4"
                  onClick={() => setSelectedId(null)}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
          <AdminContentList
            collectionKey={section.collectionKey}
            emptyHint={section.emptyHint}
            onOpen={setSelectedId}
            selectedId={selectedId}
            title={section.title}
          />
        </>
      ) : (
        <section className="parchment-card grid gap-3 p-6">
          <p className="text-sm leading-6 text-admin-ink-soft">
            {section.emptyHint || "Manage this from your Tuturuuu workspace."}
          </p>
          <Link className="button-secondary w-fit" href="/admin">
            Back to the dashboard
          </Link>
        </section>
      )}
    </div>
  );
}
