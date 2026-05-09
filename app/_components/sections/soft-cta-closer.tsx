import { SoftCta } from "@/app/_components/primitives/soft-cta";

export function SoftCtaCloser() {
  return (
    <section
      aria-label="Get in touch"
      className="bg-green px-6 py-[clamp(72px,8vw,100px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[720px] flex-col items-center gap-8 text-center">
        <p className="font-display text-[clamp(32px,4vw,48px)] italic leading-[1.2] text-paper">
          Loved brands deserve a deliberate distributor.
        </p>
        <p className="text-[15px] text-paper/70">
          Talk to our partnerships team.
        </p>
        <SoftCta href="/contact">Get in touch</SoftCta>
      </div>
    </section>
  );
}
