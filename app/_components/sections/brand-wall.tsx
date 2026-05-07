import { BrandCell } from "@/app/_components/primitives/brand-cell";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";
import { homepageBrands } from "@/content/en/brands";

export function BrandWall() {
  return (
    <section
      aria-label="Our brands"
      className="bg-cream px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col gap-14">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">Our brands</Eyebrow>
          <DisplayHeading
            level={2}
            className="max-w-[24ch]"
          >
            Trusted by the world's most *loved* brands.
          </DisplayHeading>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
          {homepageBrands.map((b) => (
            <BrandCell
              key={b.name}
              name={b.name}
              country={b.country}
              logoSrc={b.logoSrc}
              feature={b.feature}
              featureCaption={b.featureCaption}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
