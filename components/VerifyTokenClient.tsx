"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { sanitizeRichfieldNextPath } from "@/lib/richfield-url-utils";

type VerificationState = "failed" | "invited" | "loading" | "success";

type VerificationResponse = {
  error?: string;
  userId?: string;
  valid?: boolean;
};

export function VerifyTokenClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<VerificationState>("loading");
  const [pendingInvitation, setPendingInvitation] = useState<{
    invitationActionToken: string;
  } | null>(null);
  const [decisionPending, setDecisionPending] = useState(false);
  const nextPath = useMemo(
    () =>
      sanitizeRichfieldNextPath(
        searchParams.get("nextUrl"),
        typeof window === "undefined" ? "http://localhost" : window.location.origin,
        "/admin",
      ),
    [searchParams],
  );

  useEffect(() => {
    let cancelled = false;

    async function verifyToken() {
      const token = searchParams.get("token");

      if (!token) {
        router.replace(nextPath);
        router.refresh();
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-app-token", {
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const data = (await response.json().catch(() => null)) as VerificationResponse | null;

        // Invited but not yet a member: offer to accept rather than reporting
        // a sign-in failure they cannot act on.
        const invitation = (data as { pendingInvitation?: { invitationActionToken?: string } } | null)
          ?.pendingInvitation;

        if (response.ok && invitation?.invitationActionToken) {
          if (cancelled) return;
          setPendingInvitation({ invitationActionToken: invitation.invitationActionToken });
          setState("invited");
          return;
        }

        if (!response.ok || !data?.valid || !data.userId) {
          throw new Error(data?.error || "Token verification failed.");
        }

        if (cancelled) {
          return;
        }

        setState("success");
        router.replace(nextPath);
        router.refresh();
      } catch (verificationError) {
        if (cancelled) {
          return;
        }

        setError(
          verificationError instanceof Error ? verificationError.message : "Token verification failed.",
        );
        setState("failed");
      }
    }

    void verifyToken();

    return () => {
      cancelled = true;
    };
  }, [nextPath, router, searchParams]);

  async function decideInvitation(action: "accept" | "reject") {
    if (!pendingInvitation || decisionPending) return;

    setDecisionPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/pending-invitation", {
        body: JSON.stringify({
          action,
          invitationActionToken: pendingInvitation.invitationActionToken,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "Could not update the invitation.");
      }

      // Declining is a decision, not a failure: send them back to the site
      // rather than into a retry loop on a workspace they just left.
      router.replace(action === "accept" ? "/admin/login?next=library" : "/");
      router.refresh();
    } catch (decisionError) {
      setError(
        decisionError instanceof Error
          ? decisionError.message
          : "Could not update the invitation.",
      );
      setDecisionPending(false);
    }
  }

  if (state === "invited") {
    return (
      <>
        <span aria-hidden className="block h-px w-12 bg-gold opacity-80" />
        <h1 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.4rem)] leading-[1.05] tracking-[-0.015em] text-gold">
          You have been invited
        </h1>
        <p className="mt-3 text-sm leading-6 text-cream/72">
          Accept your invitation to the Richfield workspace to open the content
          dashboard.
        </p>
        {error ? (
          <p
            className="mt-3 border-l-2 border-red-300/50 pl-3 text-sm leading-6 text-cream/80"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-7 grid gap-2.5">
          <button
            className="button-primary w-full"
            disabled={decisionPending}
            onClick={() => void decideInvitation("accept")}
            type="button"
          >
            {decisionPending ? "Joining…" : "Accept and continue"}
          </button>
          <button
            className="button-secondary w-full"
            disabled={decisionPending}
            onClick={() => void decideInvitation("reject")}
            type="button"
          >
            Decline
          </button>
        </div>
      </>
    );
  }

  if (state === "failed") {
    return (
      <>
        <span aria-hidden className="block h-px w-12 bg-red-300/70" />
        <h1 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.4rem)] leading-[1.05] tracking-[-0.015em] text-gold">
          We could not sign you in
        </h1>
        {/* The upstream reason, verbatim: it is the only thing that tells an
            operator whether to retry or to ask for workspace access. */}
        <p
          className="mt-3 border-l-2 border-red-300/50 pl-3 text-sm leading-6 text-cream/80"
          role="alert"
        >
          {error}
        </p>
        <div className="mt-7 grid gap-2.5">
          <Link
            className="button-primary w-full"
            href="/admin/login?next=library"
          >
            Try signing in again
          </Link>
          <Link className="button-secondary w-full" href="/">
            Back to the site
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <span
        aria-hidden
        className="block h-px w-12 bg-gold opacity-80"
      />
      <h1 className="mt-5 font-display text-[clamp(1.9rem,3.4vw,2.4rem)] leading-[1.05] tracking-[-0.015em] text-gold">
        {state === "success" ? "You are signed in" : "Signing you in"}
      </h1>
      <p
        aria-live="polite"
        className="mt-3 text-sm leading-6 text-cream/70"
      >
        {state === "success"
          ? "Opening your dashboard…"
          : "Confirming your Tuturuuu account."}
      </p>
      <div aria-hidden className="mt-7 grid gap-2">
        <span className="admin-skeleton block h-3 w-full opacity-40" />
        <span className="admin-skeleton block h-3 w-[76%] opacity-40" />
      </div>
    </>
  );
}
