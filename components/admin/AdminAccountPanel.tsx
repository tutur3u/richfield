"use client";

import { ArrowSquareOut, CheckCircle, ShieldCheck, SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getInitials } from "./AdminMembersPanel";

export function AdminAccountPanel({ userEmail }: { userEmail: string | null }) {
  const locale = useLocale();
  const t = useTranslations("admin.account");

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
      <Card className="border border-admin-rule bg-admin-panel py-0 shadow-none ring-0">
        <CardHeader className="border-b border-admin-rule px-5 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-12" size="lg">
              <AvatarFallback className="bg-admin-navy font-display text-lg text-white">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate font-display text-2xl text-admin-ink">
                {userEmail ?? t("editorFallback")}
              </CardTitle>
              <CardDescription className="mt-1 text-admin-ink-soft">
                {t("description")}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-admin-ink">
              <ShieldCheck aria-hidden className="text-admin-clay" size={19} />
              {t("access")}
            </div>
            <Badge className="bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" variant="secondary">
              <CheckCircle aria-hidden data-icon="inline-start" size={13} />
              {t("active")}
            </Badge>
          </div>
          <Separator className="bg-admin-rule" />
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-admin-ink-soft">{t("language")}</span>
            <span className="font-semibold text-admin-ink">
              {locale === "vi" ? "Tiếng Việt" : "English"}
            </span>
          </div>
          <div className="rounded-xl border border-admin-rule bg-admin-surface px-4 py-3 text-sm leading-6 text-admin-ink-soft">
            {t("preferencesHint")}
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit border border-admin-rule bg-admin-panel py-0 shadow-none ring-0">
        <CardHeader className="px-5 py-5 sm:px-6">
          <CardTitle className="font-display text-2xl text-admin-ink">
            {t("quickActions")}
          </CardTitle>
          <CardDescription className="text-admin-ink-soft">
            {t("quickActionsDescription")}
          </CardDescription>
        </CardHeader>
        <CardFooter className="grid gap-2 border-t border-admin-rule bg-admin-surface px-5 py-5 sm:px-6">
          <Link
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-10 w-full rounded-lg bg-admin-navy text-white hover:bg-admin-navy/90",
            )}
            href="/"
          >
            <ArrowSquareOut aria-hidden data-icon="inline-start" size={17} />
            {t("viewSite")}
          </Link>
          <form action="/api/auth/logout" method="post">
            <Button
              className={cn(
                "h-10 w-full border-admin-rule bg-admin-panel text-admin-ink hover:bg-admin-surface",
              )}
              size="lg"
              type="submit"
              variant="outline"
            >
              <SignOut aria-hidden data-icon="inline-start" size={17} />
              {t("signOut")}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
