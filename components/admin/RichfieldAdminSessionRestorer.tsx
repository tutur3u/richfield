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
    <main className="section-band grid min-h-[calc(100vh-96px)] place-items-center px-4 py-12 sm:px-6">
      <section className="parchment-card w-full max-w-[420px] p-6 text-center sm:p-8">
        <p className="script-label">Admin access</p>
        <h1 className="font-display text-4xl leading-none text-[var(--navy)] sm:text-5xl">
          {failed ? "Login expired" : "Restoring access"}
        </h1>
        <p className="mx-auto mt-3 max-w-[300px] text-sm leading-6 text-[var(--ink-soft)]">
          {failed
            ? "Login again to continue managing the website."
            : "Refreshing your access before opening the dashboard."}
        </p>
        {failed ? (
          <Link className="button-primary mt-6 inline-flex" href={loginHref}>
            Login with Tuturuuu
          </Link>
        ) : (
          <div className="mx-auto mt-6 grid w-full max-w-[220px] gap-2" aria-hidden="true">
            <span className="h-2 animate-pulse bg-[rgba(184,112,81,0.22)]" />
            <span className="h-2 animate-pulse bg-[rgba(184,112,81,0.22)] [animation-delay:120ms]" />
            <span className="h-2 animate-pulse bg-[rgba(184,112,81,0.22)] [animation-delay:240ms]" />
          </div>
        )}
      </section>
    </main>
  );
}
