import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const TUTURUUU_LOGO_URL = "/media/branding/tuturuuu.svg";

/**
 * Sign-in screen for the content dashboard.
 *
 * Editorial rather than a generic auth card: a navy masthead panel carrying the
 * Richfield voice sits beside the single action, so the door into the tool
 * still looks like the publication it edits. There is exactly one way in —
 * access is centralised in Tuturuuu — so the screen commits to that instead of
 * offering a form it cannot honour.
 */
export function RichfieldAdminLoginPanel({ loginHref }: { loginHref: string }) {
  const t = useTranslations("admin.login");

  return (
    <main className="section-band grid min-h-screen place-items-center px-4 py-10 sm:px-6">
      <section className="parchment-card grid w-full max-w-[880px] overflow-hidden md:grid-cols-[1.05fr_1fr]">
        {/* Masthead. Hidden below md: on a phone it would push the action
            below the fold for no gain. */}
        <div className="relative hidden flex-col justify-between bg-ink p-8 text-cream md:flex lg:p-10">
          <div
            aria-hidden
            className="absolute inset-x-8 top-0 h-px bg-gold opacity-70 lg:inset-x-10"
          />
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gold">
            Richfield
          </p>
          <div className="py-10">
            <h1 className="font-display text-[clamp(2.5rem,4.6vw,3.6rem)] leading-[0.98] tracking-[-0.02em]">
              {t("masthead")}
            </h1>
            <p className="mt-5 max-w-[34ch] text-sm leading-7 text-cream/70">
              {t("mastheadDescription")}
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream/45">
            {t("staffOnly")}
          </p>
        </div>

        <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
          <Image
            alt=""
            className="mb-6"
            height={44}
            priority
            src={TUTURUUU_LOGO_URL}
            width={44}
          />
          <p className="script-label">{t("eyebrow")}</p>
          <h2 className="mt-2 font-display text-[clamp(1.9rem,3.4vw,2.5rem)] leading-[1.02] tracking-[-0.015em] text-ink">
            {t("continue")}
          </h2>
          <p className="mt-3 max-w-[36ch] text-sm leading-6 text-admin-ink-soft">
            {t("description")}
          </p>

          <div className="mt-7 grid gap-2.5">
            <a className="button-primary w-full" href={loginHref}>
              {t("continue")}
            </a>
            <Link className="button-secondary w-full" href="/">
              {t("back")}
            </Link>
          </div>
          <form
            action="/api/admin/locale"
            className="mt-4 flex justify-center gap-2 text-xs"
            method="post"
          >
            <input name="next" type="hidden" value="/admin/news" />
            <button
              className="px-2 py-1 font-bold text-admin-ink-soft hover:text-ink"
              name="locale"
              type="submit"
              value="en"
            >
              English
            </button>
            <span aria-hidden className="py-1 text-line">/</span>
            <button
              className="px-2 py-1 font-bold text-admin-ink-soft hover:text-ink"
              name="locale"
              type="submit"
              value="vi"
            >
              Tiếng Việt
            </button>
          </form>

          <p className="mt-6 border-t border-line pt-4 text-xs leading-5 text-admin-ink-soft">
            {t("help")}
          </p>
        </div>
      </section>
    </main>
  );
}
