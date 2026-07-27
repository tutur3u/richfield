"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, GlobeHemisphereWest, WarningCircle } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { contentKeys } from "@/lib/admin/content-queries";
import type {
  RichfieldAdminCollectionKey,
  RichfieldAdminContentItem,
} from "@/lib/richfield-admin-content-model";
import { ContentForm } from "./AdminContentForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <div className="grid gap-5 pb-16">
      <div className="sticky top-16 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-admin-rule bg-admin-surface/95 px-3 py-2.5 shadow-sm backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            aria-label={t("back")}
            className="border-admin-rule bg-admin-panel text-admin-ink hover:bg-admin-parchment"
            onClick={requestClose}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <ArrowLeft aria-hidden size={18} />
          </Button>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-admin-ink">
              {initialItem?.title ?? t("createTitle", { item: "content" })}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-admin-ink-soft">
              {dirty ? (
                <>
                  <WarningCircle aria-hidden className="text-amber-500" size={13} />
                  {t("unsavedDescription")}
                </>
              ) : (
                <>
                  <CheckCircle aria-hidden className="text-emerald-500" size={13} />
                  {t("allChangesSaved")}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlobeHemisphereWest
            aria-hidden
            className="hidden text-admin-ink-soft sm:block"
            size={18}
          />
          <Tabs
            aria-label={t("contentLanguage")}
            onValueChange={(value) => switchLocale(value === "vi" ? "vi" : "en")}
            value={contentLocale}
          >
            <TabsList className="h-9 rounded-lg border border-admin-rule bg-admin-panel p-1">
              <TabsTrigger className="h-7 px-3 text-xs data-active:bg-admin-navy data-active:text-white" value="en">
                {t("english")}
              </TabsTrigger>
              <TabsTrigger className="h-7 px-3 text-xs data-active:bg-admin-navy data-active:text-white" value="vi">
                {t("vietnamese")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Badge
            className="hidden border-admin-rule text-admin-ink-soft md:inline-flex"
            variant="outline"
          >
            {contentLocale.toUpperCase()}
          </Badge>
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

      <AlertDialog onOpenChange={setConfirmClose} open={confirmClose}>
        <AlertDialogContent className="border border-admin-rule bg-admin-panel text-admin-ink">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              {t("unsavedTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-admin-ink-soft">
              {t("unsavedDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-admin-rule bg-admin-surface">
            <AlertDialogCancel>{t("keepEditing")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-admin-navy text-white hover:bg-admin-navy/90"
              onClick={close}
            >
              {t("discard")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
