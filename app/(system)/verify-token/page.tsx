import { VerifyTokenClient } from "@/components/VerifyTokenClient";
import { Suspense } from "react";

function VerifyTokenFallback() {
  return (
    <>
      <div className="grid size-12 place-items-center border border-line font-display text-2xl text-gold">
        ...
      </div>
      <h1 className="mt-5 font-display text-4xl leading-none text-gold">
        Connecting Richfield
      </h1>
      <p className="mt-3 text-sm leading-6 text-admin-ink-soft">
        Finishing centralized Tuturuuu authentication.
      </p>
    </>
  );
}

export default function VerifyTokenPage() {
  return (
    <main className="section-band grid min-h-screen place-items-center px-6" data-admin-theme="system">
      <section className="parchment-card w-full max-w-md p-8">
        <Suspense fallback={<VerifyTokenFallback />}>
          <VerifyTokenClient />
        </Suspense>
      </section>
    </main>
  );
}
