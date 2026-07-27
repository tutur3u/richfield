"use client";

import { useSyncExternalStore } from "react";

export type AdminTheme = "dark" | "light" | "system";

const STORAGE_KEY = "richfield-admin-theme";
const THEMES: AdminTheme[] = ["system", "light", "dark"];

function isTheme(value: unknown): value is AdminTheme {
  return typeof value === "string" && THEMES.includes(value as AdminTheme);
}

/**
 * Applied before paint by a blocking inline script, so a dark-mode editor never
 * sees a flash of the light shell on every navigation. Kept deliberately small
 * and dependency-free: it runs on the critical path.
 */
export const ADMIN_THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});if(t!=="light"&&t!=="dark"&&t!=="system"){t="system"}document.currentScript.parentElement.setAttribute("data-admin-theme",t)}catch(e){}})()`;

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
    const stored = localStorage.getItem(STORAGE_KEY);
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
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference will not persist; the current session still applies.
    }

    document
      .querySelector("[data-admin-theme]")
      ?.setAttribute("data-admin-theme", next);

    for (const listener of listeners) listener();
  }

  return { setTheme, theme };
}

const LABELS: Record<AdminTheme, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

export function AdminThemeToggle() {
  const { setTheme, theme } = useAdminTheme();

  return (
    <div
      aria-label="Theme"
      className="flex items-center border border-line"
      role="group"
    >
      {THEMES.map((option) => (
        <button
          aria-pressed={theme === option}
          className={`min-h-9 px-2.5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
            theme === option
              ? "bg-gold-strong/12 text-gold-strong"
              : "text-muted hover:text-ink"
          }`}
          key={option}
          onClick={() => setTheme(option)}
          type="button"
        >
          {LABELS[option]}
        </button>
      ))}
    </div>
  );
}
