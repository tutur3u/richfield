import type { Metadata } from "next";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { ContactForm } from "@/app/_components/forms/contact-form";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import {
  FacebookIcon,
  PhoneIcon,
  EmailIcon,
  MapPinIcon,
} from "@/app/_components/primitives/social-icons";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { getRichfieldContent } from "@/lib/richfield-delivery";
import { site } from "@/content/en/site";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates, toLocale } from "@/lib/locale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  const meta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: meta("contact.title"),
    description: meta("contact.description"),
    alternates: localeAlternates("/contact"),
  };
}

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.legalName,
  url: site.domainCanonical,
  telephone: site.phones.officeTel,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: "Ho Chi Minh City",
    addressRegion: "Nha Be",
    addressCountry: "VN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.address.geo.lat,
    longitude: site.address.geo.lng,
  },
};

const channelIconByKind = {
  email: {
    Icon: EmailIcon,
    iconBg: "bg-cream",
    iconFg: "text-ink",
  },
  facebook: {
    Icon: FacebookIcon,
    iconBg: "bg-[#1877F2]",
    iconFg: "text-white",
  },
  office: {
    Icon: MapPinIcon,
    iconBg: "bg-green",
    iconFg: "text-paper",
  },
  phone: {
    Icon: PhoneIcon,
    iconBg: "bg-gold",
    iconFg: "text-ink",
  },
} as const;

function getChannelIcon(kind: string) {
  return channelIconByKind[kind as keyof typeof channelIconByKind] ?? channelIconByKind.email;
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const { contactChannels, contactForm, contactPage } = await getRichfieldContent(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const mapQuery = encodeURIComponent(contactPage.mapQuery);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <RunningHead locale={locale} />

      <section
        aria-label={t("eyebrow")}
        className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-cream-gradient pb-[var(--v2-section)] pt-[calc(var(--v2-runhead)+var(--v2-section)/2)]"
      >
        <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-y-[var(--v2-flow)] px-6 sm:px-10 lg:px-12">
          {/* Compact heading — spans full width (nothing on the right). */}
          <RevealOnScroll className="flex w-full flex-col gap-y-[var(--v2-rhythm)]">
            <Eyebrow tone="gold">{t("eyebrow")}</Eyebrow>
            <DisplayHeading level={1} className="w-full text-[clamp(34px,4vw,56px)]!">
              {contactPage.headline}
            </DisplayHeading>
            <p className="w-full text-[clamp(15px,1.3vw,17px)] leading-[1.55] text-muted">
              {contactPage.intro}
            </p>
          </RevealOnScroll>

          <div className="grid flex-1 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Channels — icon-coded for instant differentiation */}
            <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow tone="ink">{t("channelsEyebrow")}</Eyebrow>
              <ul className="flex flex-col gap-3">
                {contactChannels.map((c, idx) => {
                  const { Icon, iconBg, iconFg } = getChannelIcon(c.kind);

                  return (
                  <RevealOnScroll as="li" key={c.label} delayMs={idx * 70}>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-sm border border-line bg-paper p-4 transition-colors duration-200 hover:border-gold hover:bg-paper/80 sm:p-5"
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm ${iconBg} ${iconFg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-muted">
                          {c.label}
                        </span>
                        <span className="truncate text-[15px] text-ink">
                          {c.primary}
                        </span>
                        {c.secondary ? (
                          <span className="truncate text-[12px] text-muted">
                            {c.secondary}
                          </span>
                        ) : null}
                      </span>
                      <span
                        aria-hidden
                        className="shrink-0 text-[11px] uppercase tracking-[0.24em] text-gold transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                      <span className="sr-only">{c.cta}</span>
                    </a>
                  </RevealOnScroll>
                );
                })}
              </ul>
            </RevealOnScroll>

            {/* Form */}
            <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]" delayMs={120}>
              <Eyebrow tone="ink">{t("formEyebrow")}</Eyebrow>
              <div className="rounded-sm border border-line bg-paper p-6 sm:p-8">
                <ContactForm config={contactForm} />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section aria-label={t("mapAria")} className="px-0">
        <iframe
          title={t("mapTitle")}
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[480px] w-full border-0"
        />
      </section>
    </>
  );
}
