"use client";

import { Desktop, Moon, Sun } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import {
  type AdminTheme,
  ADMIN_THEME_STORAGE_KEY,
} from "@/lib/admin/theme";

const THEMES: AdminTheme[] = ["system", "light", "dark"];

function isTheme(value: unknown): value is AdminTheme {
  return typeof value === "string" && THEMES.includes(value as AdminTheme);
}

// A tiny store rather than component state: the value lives in localStorage,
// which React cannot see, and useSyncExternalStore is the supported way to read
// an external source without a setState-in-effect cascade.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): AdminTheme {
  try {
    const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the default
    // is still correct, so there is nothing to recover.
    return "system";
  }
}

// The server cannot know the preference, and the bootstrap script has already
// applied it before paint, so the markup starts from the neutral default.
function getServerSnapshot(): AdminTheme {
  return "system";
}

export function useAdminTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setTheme(next: AdminTheme) {
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, next);
    } catch {
      // Preference will not persist; the current session still applies.
    }

    document.documentElement.setAttribute("data-admin-theme", next);

    for (const listener of listeners) listener();
  }

  return { setTheme, theme };
}

const ICONS = {
  dark: Moon,
  light: Sun,
  system: Desktop,
};

export function AdminThemeToggle({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const { setTheme, theme } = useAdminTheme();
  const t = useTranslations("admin.theme");

  return (
    <div
      aria-label={t("label")}
      className={`${alwaysVisible ? "flex" : "hidden md:flex"} items-center rounded-full border border-admin-rule bg-admin-surface p-0.5`}
      role="group"
    >
      {THEMES.map((option) => {
        const Icon = ICONS[option];
        return (
          <button
            aria-label={t(option)}
            aria-pressed={theme === option}
            className={`grid size-8 place-items-center rounded-full transition-colors ${
              theme === option
                ? "bg-admin-navy text-white"
                : "text-admin-ink-soft hover:text-admin-ink"
            }`}
            key={option}
            onClick={() => setTheme(option)}
            title={t(option)}
            type="button"
          >
            <Icon aria-hidden size={15} />
          </button>
        );
      })}
    </div>
  );
}
