import type { Metadata } from "next";
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
import { site } from "@/content/en/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your brand. Whether you're a brand owner, partner, or journalist, we'll get back to you.",
  alternates: { canonical: "/contact" },
};

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

type Channel = {
  label: string;
  primary: string;
  secondary?: string;
  href: string;
  cta: string;
  external?: boolean;
  Icon: typeof FacebookIcon;
  iconBg: string;
  iconFg: string;
};

const channels: Channel[] = [
  {
    label: "Office",
    primary: site.address.line1,
    secondary: site.address.line2,
    href: `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`,
    cta: "Open on Maps",
    external: true,
    Icon: MapPinIcon,
    iconBg: "bg-ink",
    iconFg: "text-paper",
  },
  {
    label: "Hotline",
    primary: site.phones.hotline,
    secondary: site.phones.office,
    href: `tel:${site.phones.hotlineTel}`,
    cta: "Call hotline",
    Icon: PhoneIcon,
    iconBg: "bg-gold",
    iconFg: "text-ink",
  },
  {
    label: "Email",
    primary: site.email,
    secondary: "Partnerships team",
    href: `mailto:${site.email}`,
    cta: "Write us",
    Icon: EmailIcon,
    iconBg: "bg-cream",
    iconFg: "text-ink",
  },
  {
    label: "Facebook",
    primary: "RichField Group",
    secondary: "Daily updates",
    href: site.socials.facebook,
    cta: "Visit page",
    external: true,
    Icon: FacebookIcon,
    iconBg: "bg-[#1877F2]",
    iconFg: "text-white",
  },
];

export default function ContactPage() {
  const mapQuery = encodeURIComponent(site.address.full);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section
        aria-label="Contact"
        className="relative flex min-h-[100svh] flex-col bg-cream pb-[clamp(48px,6vw,80px)] pt-[clamp(112px,12vw,160px)]"
      >
        <div className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-[clamp(32px,4vw,56px)] px-6 sm:px-10">
          {/* Compact heading — fits above the fold with channels + form */}
          <RevealOnScroll className="flex max-w-[64ch] flex-col gap-4">
            <Eyebrow tone="gold">Contact</Eyebrow>
            <DisplayHeading level={2} className="max-w-[18ch]">
              Tell us about your *brand*.
            </DisplayHeading>
            <p className="max-w-[60ch] text-[clamp(15px,1.3vw,17px)] leading-[1.55] text-muted">
              Brand owner exploring Vietnam, partner considering a joint
              venture, or journalist on deadline — we'll write back within
              two business days.
            </p>
          </RevealOnScroll>

          <div className="grid flex-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            {/* Channels — icon-coded for instant differentiation */}
            <RevealOnScroll className="flex flex-col gap-5">
              <Eyebrow tone="gold">Channels</Eyebrow>
              <ul className="flex flex-col gap-3">
                {channels.map((c, idx) => (
                  <RevealOnScroll as="li" key={c.label} delayMs={idx * 70}>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-sm border border-line bg-paper p-4 transition-colors duration-200 hover:border-gold hover:bg-paper/80 sm:p-5"
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm ${c.iconBg} ${c.iconFg}`}
                      >
                        <c.Icon className="h-5 w-5" />
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
                ))}
              </ul>
            </RevealOnScroll>

            {/* Form */}
            <RevealOnScroll className="flex flex-col gap-5" delayMs={120}>
              <Eyebrow tone="gold">Send a message</Eyebrow>
              <div className="rounded-sm border border-line bg-paper p-6 sm:p-8">
                <ContactForm />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section aria-label="Office location" className="px-0">
        <iframe
          title="Richfield head-office on Google Maps"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-[480px] w-full border-0"
        />
      </section>
    </>
  );
}
