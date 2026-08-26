"use client";

import {
  ArrowLeft,
  CalendarBlank,
  CheckCircle,
  Envelope,
  PaperPlaneTilt,
  Trash,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { contentKeys } from "@/lib/admin/content-queries";
import type { RichfieldAdminContentItem } from "@/lib/richfield-admin-content-model";
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
import { Button } from "@/components/ui/button";
import { adminFetch } from "./richfield-admin-session-client";

function tone(status: string) {
  const value = status.toLowerCase();
  if (value === "sent" || value === "closed") return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (value === "failed") return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
  if (value === "read") return "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

function StatusBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${tone(value)}`}>
      {value.toLowerCase() === "failed" ? <WarningCircle aria-hidden size={15} /> : <CheckCircle aria-hidden size={15} />}
      <span className="text-[10px] uppercase tracking-[0.12em] opacity-70">{label}</span>
      {value || "—"}
    </span>
  );
}

function Detail({ label, value, href }: { href?: string; label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-admin-rule py-4 last:border-0 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[10px] font-black uppercase tracking-[0.16em] text-admin-ink-soft">{label}</dt>
      <dd className="min-w-0 break-words text-sm font-medium text-admin-ink">
        {href ? <a className="text-admin-clay underline decoration-admin-clay/30 underline-offset-4 hover:decoration-admin-clay" href={href}>{value}</a> : value || "—"}
      </dd>
    </div>
  );
}

export function AdminResponseDetail({ item, sectionHref }: { item: RichfieldAdminContentItem; sectionHref: string }) {
  const t = useTranslations("admin.responses");
  const common = useTranslations("admin.common");
  const locale = useLocale() === "vi" ? "vi-VN" : "en-US";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const received = item.receivedAt || item.createdAt;
  const receivedLabel = received
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Asia/Ho_Chi_Minh",
      }).format(new Date(received))
    : "—";
  const sender = item.name || item.email || t("unknownSender");

  async function remove() {
    setDeleting(true);
    try {
      const response = await adminFetch(`/api/admin/content/contact-submissions/${encodeURIComponent(item.id)}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || t("deleteFailed"));
      }
      await queryClient.invalidateQueries({ queryKey: contentKeys.collection("contact-submissions") });
      router.push(sectionHref);
      router.refresh();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : t("deleteFailed"));
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 pb-16">
      <header className="rounded-2xl border border-admin-rule bg-admin-panel p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-3">
            <Button aria-label={common("close")} className="shrink-0 border-admin-rule bg-admin-surface text-admin-ink" onClick={() => router.push(sectionHref)} size="icon-lg" variant="outline"><ArrowLeft aria-hidden /></Button>
            <div className="min-w-0">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-admin-clay">{item.inquiryType || t("enquiry")}</p>
              <h1 className="font-display text-3xl leading-tight text-admin-ink sm:text-4xl">{sender}</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-admin-ink-soft"><CalendarBlank aria-hidden size={16} />{t("received", { date: receivedLabel })}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.email ? <Button render={<a href={`mailto:${item.email}`} />} className="bg-admin-navy text-white hover:bg-admin-copper"><PaperPlaneTilt aria-hidden data-icon="inline-start" />{t("reply")}</Button> : null}
            <Button aria-label={t("delete")} className="text-red-600" onClick={() => setConfirmDelete(true)} size="icon" variant="outline"><Trash aria-hidden /></Button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-admin-rule pt-5">
          <StatusBadge label={t("submissionStatus")} value={item.submissionStatus || "new"} />
          <StatusBadge label={t("emailDelivery")} value={item.emailNotificationStatus || "pending"} />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:items-start">
        <section className="rounded-2xl border border-admin-rule bg-admin-panel p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-admin-gold/12 text-admin-clay"><Envelope aria-hidden size={20} /></span><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-admin-ink-soft">{t("messageLabel")}</p><h2 className="font-display text-2xl text-admin-ink">{t("messageTitle")}</h2></div></div>
          <div className="min-h-48 whitespace-pre-wrap break-words rounded-xl border border-admin-rule bg-admin-surface p-5 text-[15px] leading-7 text-admin-ink">{item.body || item.summary || t("noMessage")}</div>
        </section>
        <aside className="rounded-2xl border border-admin-rule bg-admin-panel p-5 sm:p-6">
          <div className="mb-2 flex items-center gap-2"><User aria-hidden className="text-admin-clay" size={19} /><h2 className="font-display text-xl text-admin-ink">{t("contactDetails")}</h2></div>
          <dl>
            <Detail label={t("name")} value={item.name} />
            <Detail label={t("company")} value={item.brand} />
            <Detail href={item.email ? `mailto:${item.email}` : undefined} label={t("email")} value={item.email} />
            <Detail label={t("country")} value={item.country} />
            <Detail label={t("inquiryType")} value={item.inquiryType} />
            <Detail label={t("receivedAt")} value={receivedLabel} />
          </dl>
        </aside>
      </div>

      <AlertDialog onOpenChange={setConfirmDelete} open={confirmDelete}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle><AlertDialogDescription>{t("deleteDescription", { name: sender })}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={deleting}>{common("cancel")}</AlertDialogCancel><AlertDialogAction className="bg-red-600 text-white hover:bg-red-700" disabled={deleting} onClick={() => void remove()}>{deleting ? t("deleting") : t("delete")}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
