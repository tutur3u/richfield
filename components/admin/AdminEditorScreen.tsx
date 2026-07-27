"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { contentKeys } from "@/lib/admin/content-queries";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";
import { ContentForm } from "./AdminContentForm";

export function AdminEditorScreen({
  collectionKey,
  initialItem,
  sectionHref,
}: {
  collectionKey: RichfieldAdminCollectionKey;
  initialItem: RichfieldAdminContentItem | null;
  sectionHref: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const t = useTranslations("admin.editor");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const contentLocale = searchParams.get("contentLocale") === "vi" ? "vi" : "en";

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const close = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(sectionHref);
    }
  }, [router, sectionHref]);

  const requestClose = () => {
    if (busy) return;
    if (dirty) {
      setConfirmClose(true);
      return;
    }
    close();
  };

  const switchLocale = (locale: "en" | "vi") => {
    const next = new URLSearchParams(searchParams);
    next.set("contentLocale", locale);
    router.replace(`${pathname}?${next}`);
  };

  return (
    <div className="grid gap-5">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border border-admin-rule bg-admin-parchment/95 px-4 py-3 shadow-sm backdrop-blur">
        <button className="button-secondary" onClick={requestClose} type="button">
          ← {t("back")}
        </button>
        <div
          aria-label={t("contentLanguage")}
          className="flex border border-admin-rule bg-white"
          role="group"
        >
          {(["en", "vi"] as const).map((locale) => (
            <button
              aria-pressed={contentLocale === locale}
              className={`min-h-10 px-4 text-xs font-black uppercase tracking-[0.12em] ${
                contentLocale === locale
                  ? "bg-admin-navy text-white"
                  : "text-admin-ink hover:bg-black/5"
              }`}
              key={locale}
              onClick={() => switchLocale(locale)}
              type="button"
            >
              {locale === "en" ? t("english") : t("vietnamese")}
            </button>
          ))}
        </div>
      </div>

      <ContentForm
        collectionKey={collectionKey}
        contentLocale={contentLocale}
        item={initialItem}
        key={`${initialItem?.id ?? "new"}-${contentLocale}`}
        onBusyChange={setBusy}
        onClose={close}
        onCloseRequest={requestClose}
        onDeleted={() => {
          void queryClient.invalidateQueries({
            queryKey: contentKeys.collection(collectionKey),
          });
        }}
        onDirtyChange={setDirty}
        onSaved={(_items, item) => {
          setDirty(false);
          void queryClient.invalidateQueries({
            queryKey: contentKeys.collection(collectionKey),
          });
          if (!initialItem && item) {
            const query = new URLSearchParams({ contentLocale });
            router.replace(
              `${sectionHref}/${encodeURIComponent(item.id)}?${query}`,
            );
          }
        }}
      />

      {confirmClose ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-admin-navy/65 px-4"
          role="presentation"
        >
          <section
            aria-modal="true"
            className="parchment-card w-full max-w-md p-6"
            role="alertdialog"
          >
            <h2 className="font-display text-3xl text-admin-navy">
              {t("unsavedTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-admin-ink-soft">
              {t("unsavedDescription")}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="button-secondary"
                onClick={() => setConfirmClose(false)}
                type="button"
              >
                {t("keepEditing")}
              </button>
              <button className="button-primary" onClick={close} type="button">
                {t("discard")}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
