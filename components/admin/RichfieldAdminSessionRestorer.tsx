"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { refreshRichfieldAdminSession } from "./richfield-admin-session-client";

export function RichfieldAdminSessionRestorer({ loginHref }: { loginHref: string }) {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restoreAccess() {
      try {
        const payload = await refreshRichfieldAdminSession();

        if (cancelled) return;

        if (payload?.valid) {
          router.refresh();
          return;
        }

        setFailed(true);
      } catch {
        if (!cancelled) {
          setFailed(true);
        }
      }
    }

    void restoreAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="section-band grid min-h-screen place-items-center px-4 py-12 sm:px-6">
      <section className="parchment-card w-full max-w-[460px] p-7 sm:p-9">
        <span
          aria-hidden
          className="block h-px w-12 bg-[var(--gold)] opacity-80"
        />
        <p className="script-label mt-5">
          {failed ? "Session ended" : "One moment"}
        </p>
        <h1 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,2.5rem)] leading-[1.02] tracking-[-0.015em] text-[var(--navy)]">
          {failed ? "Please sign in again" : "Restoring your access"}
        </h1>
        <p
          aria-live="polite"
          className="mt-3 max-w-[38ch] text-sm leading-6 text-[var(--ink-soft)]"
        >
          {failed
            ? "Your session has expired. Signing in again will bring you straight back here."
            : "Checking your Tuturuuu session before the dashboard opens."}
        </p>
        {failed ? (
          <Link className="button-primary mt-7 w-full" href={loginHref}>
            Continue with Tuturuuu
          </Link>
        ) : (
          <div aria-hidden className="mt-7 grid gap-2">
            <span className="admin-skeleton block h-3 w-full" />
            <span className="admin-skeleton block h-3 w-[82%]" />
            <span className="admin-skeleton block h-3 w-[56%]" />
          </div>
        )}
      </section>
    </main>
  );
}
