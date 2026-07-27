"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import type { AdminSection } from "@/lib/admin/sections";
import type { RichfieldContentPage } from "@/lib/admin/content-queries";
import { AdminContentList } from "./AdminContentList";

/**
 * The body of one dashboard section.
 *
 * Sections backed by a collection get the searchable, infinitely scrolling
 * list. The few that are not a list (files, people, account) say plainly where
 * that work happens rather than rendering an empty shell — a dead panel reads
 * as broken, a signpost does not.
 */
export function AdminSectionScreen({
  initialPage,
  section,
}: {
  initialPage?: RichfieldContentPage;
  section: AdminSection;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("admin");
  const sectionTitleKey =
    `sections.${section.slug}.title` as Parameters<typeof t>[0];
  const sectionDescriptionKey =
    `sections.${section.slug}.description` as Parameters<typeof t>[0];
  const sectionEmptyKey =
    `sections.${section.slug}.empty` as Parameters<typeof t>[0];
  const title = t(sectionTitleKey);
  const description = t(sectionDescriptionKey);
  const emptyHint = t(sectionEmptyKey);

  return (
    <div className="grid min-w-0 gap-6">
      <header className="grid gap-2 border-b border-admin-rule pb-6">
        <h1 className="font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.025em] text-admin-navy">
          {title}
        </h1>
        <p className="max-w-[60ch] text-sm leading-6 text-admin-ink-soft">
          {description}
        </p>
      </header>

      {section.collectionKey ? (
        <AdminContentList
          collectionKey={section.collectionKey}
          emptyHint={emptyHint}
          initialPage={initialPage}
          onOpen={(id) =>
            router.push(`${pathname}/${id === null ? "new" : encodeURIComponent(id)}`)
          }
          title={title}
        />
      ) : (
        <section className="parchment-card grid gap-3 p-6">
          <p className="text-sm leading-6 text-muted">
            {emptyHint}
          </p>
          <Link className="button-secondary w-fit" href="/admin/news">
            {t("sections.news.title")}
          </Link>
        </section>
      )}
    </div>
  );
}
