import type { Metadata } from "next";
import { PageHeader } from "@/app/_components/primitives/page-header";
import { ContactForm } from "@/app/_components/forms/contact-form";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
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

const channels = [
  {
    label: "Office",
    primary: site.address.full,
    href: `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}`,
    cta: "Open on Google Maps",
    external: true,
  },
  {
    label: "Hotline",
    primary: site.phones.hotline,
    href: `tel:${site.phones.hotlineTel}`,
    cta: "Call hotline",
  },
  {
    label: "Email",
    primary: site.email,
    href: `mailto:${site.email}`,
    cta: "Write us",
  },
  {
    label: "Social",
    primary: "Facebook · LinkedIn · Zalo",
    href: site.socials.facebook,
    cta: "Visit Facebook",
    external: true,
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

      <PageHeader
        eyebrow="Contact"
        heading="Tell us about your *brand*."
        lede="Whether you're an international brand owner exploring Vietnam, a partner considering a joint venture, or a journalist on deadline, we'll get back to you."
      />

      <section className="bg-cream px-6 py-[clamp(72px,8vw,100px)] sm:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-2">
          <div className="flex flex-col">
            <Eyebrow tone="gold">Channels</Eyebrow>
            <ul className="mt-8 flex flex-col">
              {channels.map((c) => (
                <li
                  key={c.label}
                  className="grid gap-2 border-t border-line py-6 sm:grid-cols-[14ch_1fr]"
                >
                  <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
                    {c.label}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] text-ink">{c.primary}</span>
                    <a
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="text-[11px] uppercase tracking-[0.32em] text-gold underline decoration-gold underline-offset-[6px]"
                    >
                      {c.cta}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Eyebrow tone="gold">Send a message</Eyebrow>
            <div className="mt-8">
              <ContactForm />
            </div>
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
