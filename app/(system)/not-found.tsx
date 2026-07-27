import Link from "next/link";

/**
 * Not-found boundary for the system routes (admin, login, verify-token).
 *
 * Without one in this route group, notFound() from a dynamic admin page fell
 * through to the root boundary and answered 200 with not-found content — so a
 * mistyped dashboard URL read as a working page to anything checking status
 * codes. Declaring the boundary here is what makes the 404 real.
 */
export default function SystemNotFound() {
  return (
    <main className="section-band grid min-h-screen place-items-center px-4 py-12 sm:px-6">
      <section className="parchment-card w-full max-w-[460px] p-7 sm:p-9">
        <span aria-hidden className="block h-px w-12 bg-gold opacity-80" />
        <p className="script-label mt-5">Not found</p>
        <h1 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,2.5rem)] leading-[1.02] tracking-[-0.015em] text-ink">
          That page does not exist
        </h1>
        <p className="mt-3 max-w-[38ch] text-sm leading-6 text-muted">
          The link may be out of date, or the section may have been renamed.
        </p>
        <div className="mt-7 grid gap-2.5">
          <Link className="button-primary w-full" href="/admin/news">
            Go to the dashboard
          </Link>
          <Link className="button-secondary w-full" href="/">
            Back to the site
          </Link>
        </div>
      </section>
    </main>
  );
}
