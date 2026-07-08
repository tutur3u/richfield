import { VerifyTokenClient } from "@/components/VerifyTokenClient";
import { Suspense } from "react";

function VerifyTokenFallback() {
  return (
    <>
      <div className="grid size-12 place-items-center border border-[rgba(217,167,91,0.62)] bg-[rgba(239,207,178,0.08)] font-display text-2xl text-[var(--gold)]">
        ...
      </div>
      <h1 className="mt-5 font-display text-4xl leading-none text-[var(--gold)]">
        Connecting Richfield
      </h1>
      <p className="mt-3 text-sm leading-6 text-[var(--parchment-soft)]">
        Finishing centralized Tuturuuu authentication.
      </p>
    </>
  );
}

export default function VerifyTokenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--navy-deep)] px-6 text-[var(--parchment)]">
      <section className="w-full max-w-md border border-[rgba(217,167,91,0.42)] bg-[rgba(14,38,61,0.88)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <Suspense fallback={<VerifyTokenFallback />}>
          <VerifyTokenClient />
        </Suspense>
      </section>
    </main>
  );
}
