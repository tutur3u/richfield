"use client";

import {
  ExternalLink,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AdminTheme } from "@/lib/admin/theme";
import { useAdminTheme } from "./AdminTheme";

const THEME_ICONS = {
  dark: Moon,
  light: Sun,
  system: Monitor,
} satisfies Record<AdminTheme, typeof Monitor>;

export function AdminUserMenu({
  accountLabel,
  adminLanguageLabel,
  darkLabel,
  englishLabel,
  lightLabel,
  locale,
  nextPath,
  signOutLabel,
  signedInLabel,
  systemLabel,
  themeLabel,
  userEmail,
  vietnameseLabel,
  viewSiteLabel,
}: {
  accountLabel: string;
  adminLanguageLabel: string;
  darkLabel: string;
  englishLabel: string;
  lightLabel: string;
  locale: string;
  nextPath: string;
  signOutLabel: string;
  signedInLabel: string;
  systemLabel: string;
  themeLabel: string;
  userEmail: string;
  vietnameseLabel: string;
  viewSiteLabel: string;
}) {
  const localeFormRef = useRef<HTMLFormElement>(null);
  const { setTheme, theme } = useAdminTheme();
  const initial = userEmail.slice(0, 1).toUpperCase();

  function updateLocale(value: string) {
    const input = localeFormRef.current?.elements.namedItem("locale");
    if (input instanceof HTMLInputElement) input.value = value;
    localeFormRef.current?.requestSubmit();
  }

  return (
    <>
      <form action="/api/admin/locale" className="hidden" method="post" ref={localeFormRef}>
        <input name="next" type="hidden" value={nextPath} />
        <input name="locale" type="hidden" value={locale} />
      </form>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label={accountLabel}
              className="rounded-full"
              size="icon-lg"
              variant="ghost"
            />
          }
        >
          <Avatar>
            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 rounded-xl p-1.5"
          sideOffset={8}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-2">
              <span className="block text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {signedInLabel}
              </span>
              <span className="mt-1 block truncate text-sm font-semibold text-foreground">
                {userEmail}
              </span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 px-2">
              <Languages aria-hidden />
              {adminLanguageLabel}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup onValueChange={updateLocale} value={locale}>
              <DropdownMenuRadioItem value="en">
                {englishLabel}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="vi">
                {vietnameseLabel}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>{themeLabel}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              onValueChange={(value) => setTheme(value as AdminTheme)}
              value={theme}
            >
              {(
                [
                  ["system", systemLabel],
                  ["light", lightLabel],
                  ["dark", darkLabel],
                ] as const
              ).map(([value, label]) => {
                const Icon = THEME_ICONS[value];
                return (
                  <DropdownMenuRadioItem key={value} value={value}>
                    <Icon aria-hidden />
                    {label}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem render={<Link href="/" />}>
              <ExternalLink aria-hidden />
              {viewSiteLabel}
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/admin/account" />}>
              <Settings aria-hidden />
              {accountLabel}
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <form action="/api/auth/logout" method="post">
            <DropdownMenuItem
              render={<button className="w-full" type="submit" />}
              variant="destructive"
            >
              <LogOut aria-hidden />
              {signOutLabel}
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
