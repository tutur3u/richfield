import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { RunningHead } from "@/app/_components/magazine/chrome/running-head";
import { Eyebrow } from "@/app/_components/magazine/primitives/spread";
import { CareersHero } from "@/app/_components/magazine/spreads/careers-hero";
import { LifeValues } from "@/app/_components/sections/life-values";
import { LifeGallery } from "@/app/_components/sections/life-gallery";
import { CtaLink } from "@/app/_components/magazine/primitives/cta-link";
import { YouTubeEmbed } from "@/app/_components/primitives/youtube-embed";
import { RevealOnScroll } from "@/app/_components/reveal-on-scroll";
import { benefits, benefitsIntro } from "@/content/en/values";
import { leaders, peopleFirstIntro } from "@/content/en/leadership";
import { testimonials } from "@/content/en/testimonials";
import { communityIntro, communityPrograms } from "@/content/en/community";
import { openPositions } from "@/content/en/careers";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Richfield is a place where people stay. Core values, people-first leadership, community impact, and life across our offices.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <RunningHead />
      <main className="v2-bg-morph text-ink">
        <CareersHero />

        {/* Life at Richfield — intro + core values (thumb-index foldout) */}
        <LifeValues />

        {/* Life at Richfield — the year in pictures, divided by event. */}
        <LifeGallery />

        {/* Why Richfield — people-first leadership */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <RevealOnScroll className="flex w-full flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow>WHY RICHFIELD</Eyebrow>
              <h2 className="font-display v2-size-standfirst w-full text-balance">
                Leadership that genuinely <em className="italic text-gold-strong">cares</em>.
              </h2>
              <p className="v2-size-body w-full text-justify opacity-90">{peopleFirstIntro}</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[clamp(40px,5vw,64px)] lg:grid-cols-2">
              {leaders.map((leader) => (
                <RevealOnScroll as="article" key={leader.name} className="flex flex-col gap-y-[var(--v2-rhythm)]">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={leader.photo}
                      alt={`${leader.name}, ${leader.role}.`}
                      fill
                      sizes="(min-width:1024px) 42vw, 100vw"
                      className="object-cover v2-photo-duotone"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-[clamp(1.6rem,2.2vw,2rem)] leading-[1.1] tracking-[-0.018em]">
                      {leader.name}
                    </h3>
                    <p className="v2-mono v2-size-folio mt-1 text-gold-strong">
                      {leader.role.toUpperCase()}
                    </p>
                  </div>
                  <p className="v2-size-body text-justify opacity-90">{leader.bio}</p>
                  {leader.quote ? (
                    <blockquote className="border-l-2 border-gold-strong pl-5">
                      <p className="v2-italic text-[clamp(1.2rem,1.8vw,1.5rem)] leading-[1.3] text-gold-strong">
                        “{leader.quote}”
                      </p>
                    </blockquote>
                  ) : null}
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* What employees say */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <Eyebrow>WHAT EMPLOYEES SAY</Eyebrow>
            <div className="grid grid-cols-1 gap-[clamp(16px,2vw,24px)] lg:grid-cols-2">
              {testimonials.map((t, i) => (
                <RevealOnScroll
                  as="figure"
                  key={t.author}
                  delayMs={i * 90}
                  className="flex flex-col gap-5 rounded-sm border border-line bg-paper p-7 sm:p-9"
                >
                  <span
                    aria-hidden
                    className="font-display text-[2.75rem] leading-[0.6] text-gold-strong"
                  >
                    “
                  </span>
                  <blockquote className="font-display text-[clamp(1.3rem,2vw,1.7rem)] italic leading-[1.32]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="v2-mono v2-size-folio mt-auto border-t border-current/12 pt-4 opacity-65">
                    {t.author.toUpperCase()} · {t.tenure} · {t.role}
                  </figcaption>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* What this looks like in practice — benefits */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[var(--v2-flow)] lg:grid-cols-[28ch_1fr]">
            <RevealOnScroll className="flex flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow>IN PRACTICE</Eyebrow>
              <p className="v2-size-body max-w-[34ch] text-justify opacity-90">{benefitsIntro}</p>
            </RevealOnScroll>
            <ul className="flex flex-col">
              {benefits.map((b, i) => (
                <RevealOnScroll as="li" key={b} delayMs={i * 60} className="flex items-baseline gap-4 border-t border-current/15 py-4">
                  <span className="v2-mono v2-size-folio text-gold-strong">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v2-size-body opacity-90">{b}</span>
                </RevealOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* Community & Impact */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <RevealOnScroll className="flex w-full flex-col gap-y-[var(--v2-rhythm)]">
              <Eyebrow>COMMUNITY & IMPACT</Eyebrow>
              <h2 className="font-display v2-size-standfirst w-full text-balance">
                Care beyond the <em className="italic text-gold-strong">workplace</em>.
              </h2>
              <p className="v2-size-body w-full text-justify opacity-90">{communityIntro}</p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 gap-x-[var(--v2-col-gap)] gap-y-[clamp(32px,4vw,48px)] lg:grid-cols-3">
              {communityPrograms.map((p, i) => (
                <RevealOnScroll as="article" key={p.title} delayMs={i * 80} className="flex flex-col gap-y-[var(--v2-rhythm)]">
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={p.photo}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-display text-[clamp(1.4rem,1.9vw,1.7rem)] leading-[1.12] tracking-[-0.018em]">
                    {p.title}
                  </h3>
                  <p className="v2-size-body opacity-90">{p.body}</p>
                  {p.videoUrl ? (
                    <CtaLink href={p.videoUrl} external>
                      WATCH THE ÁO DÀI FILM
                    </CtaLink>
                  ) : null}
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Vacancies */}
        <section className="v2-display px-6 py-[var(--v2-section)] sm:px-10 lg:px-12 text-ink">
          <RevealOnScroll className="mx-auto flex max-w-[1500px] flex-col gap-y-[var(--v2-flow)]">
            <Eyebrow>VACANCIES</Eyebrow>
            {openPositions.length === 0 ? (
              <div className="flex flex-col gap-4 border-t border-current/15 pt-8">
                <p className="v2-size-body max-w-[60ch] opacity-90">
                  We&apos;re not actively recruiting right now. Reach out anyway —
                  we&apos;d like to hear from people who fit our story.
                </p>
                <Link
                  href="/contact"
                  className="v2-mono v2-size-folio w-fit text-gold-strong underline decoration-gold-strong underline-offset-[6px]"
                >
                  Get in touch →
                </Link>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="v2-mono v2-size-folio text-left opacity-55">
                    <th className="border-b border-current/15 py-4">Job title</th>
                    <th className="border-b border-current/15 py-4">Positions</th>
                    <th className="border-b border-current/15 py-4">Location</th>
                    <th className="border-b border-current/15 py-4">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((p) => (
                    <tr key={p.title} className="v2-size-body">
                      <td className="border-b border-current/15 py-4">
                        {p.href ? (
                          <Link href={p.href} className="hover:text-gold-strong">
                            {p.title}
                          </Link>
                        ) : (
                          p.title
                        )}
                      </td>
                      <td className="border-b border-current/15 py-4">{p.positions}</td>
                      <td className="border-b border-current/15 py-4">{p.location}</td>
                      <td className="border-b border-current/15 py-4">{p.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Community video — the áo dài film, embedded for those who want it */}
            <div className="border-t border-current/15 pt-[var(--v2-flow)]">
              <YouTubeEmbed
                videoId="ZTd2L_xhYt8"
                title="Richfield áo dài cultural-heritage film"
                caption="Cultural preservation — the áo dài association"
              />
            </div>
          </RevealOnScroll>
        </section>

      </main>
    </>
  );
}
