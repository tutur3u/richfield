import Image from "next/image";
import { Eyebrow } from "@/app/_components/primitives/eyebrow";
import { DisplayHeading } from "@/app/_components/primitives/display-heading";

type Retailer = { name: string; src: string };

const CONVENIENCE: Retailer[] = [
  { name: "7-Eleven", src: "/photos/retailers/7-eleven-logo-svg.webp" },
  { name: "Circle K", src: "/photos/retailers/circle-k-logo-2015-svg.webp" },
  { name: "FamilyMart", src: "/photos/retailers/logo-familymart.webp" },
  { name: "GS25", src: "/photos/retailers/gs25-logo.webp" },
  { name: "Ministop", src: "/photos/retailers/logo-ministop.webp" },
  { name: "Cheers", src: "/photos/retailers/logo-cheers.webp" },
  { name: "B's Mart", src: "/photos/retailers/bs-mart.webp" },
];

const SUPERMARKET: Retailer[] = [
  { name: "AEON", src: "/photos/retailers/aeon-logo-svg.webp" },
  { name: "AEON Citimart", src: "/photos/retailers/aeon-citimart.webp" },
  { name: "AEON Maxvalu", src: "/photos/retailers/aeon-maxvalu.webp" },
  { name: "BigC", src: "/photos/retailers/bigclogo2022-svg.webp" },
  { name: "Go!", src: "/photos/retailers/logo-go.webp" },
  { name: "Top Market", src: "/photos/retailers/top-market.webp" },
  { name: "Tops Market", src: "/photos/retailers/tops-market-logo-vector-svg.webp" },
  { name: "Lotte Mart", src: "/photos/retailers/logo-lotte-mart-vector-thumbnail.webp" },
  { name: "WinMart", src: "/photos/retailers/winmart-logo.webp" },
  { name: "WinMart+", src: "/photos/retailers/logo-winmart-plus.webp" },
  { name: "Co.opmart", src: "/photos/retailers/coop-mart.webp" },
  { name: "Co.op Extra", src: "/photos/retailers/logo-co-op-extra.webp" },
  { name: "Co.opFood", src: "/photos/retailers/logo-co-opfood.webp" },
  { name: "Co.opSmile", src: "/photos/retailers/logo-co-opsmile.webp" },
  { name: "Satramart", src: "/photos/retailers/satramart.webp" },
  { name: "Satrafood", src: "/photos/retailers/logo-satrafood.webp" },
  { name: "Bach Hoa Xanh", src: "/photos/retailers/logo-bach-hoa-xanh-11.webp" },
  { name: "Kingfoodmart", src: "/photos/retailers/kingfoodmart.webp" },
  { name: "HaproFood / BRGMart", src: "/photos/retailers/haprofood-brgmart.webp" },
  { name: "Finelife", src: "/photos/retailers/finelife.webp" },
  { name: "Nam An Market", src: "/photos/retailers/nam-an-market.webp" },
  { name: "Annam Gourmet", src: "/photos/retailers/annam-gourmet-logo-rgb.webp" },
];

const HEALTH_BEAUTY: Retailer[] = [
  { name: "Pharmacity", src: "/photos/retailers/pharmacity.webp" },
  { name: "Guardian", src: "/photos/retailers/guardian-logo.webp" },
  { name: "Watsons", src: "/photos/retailers/logo-watsons.webp" },
  { name: "Medicare", src: "/photos/retailers/medicare.webp" },
  { name: "Long Châu", src: "/photos/retailers/nha-thuoc-long-chau.webp" },
  { name: "An Khang", src: "/photos/retailers/nha-thuoc-an-khang.webp" },
  { name: "Trung Sơn", src: "/photos/retailers/logo-nha-thuoc-trung-son.webp" },
  { name: "AEON Wellness", src: "/photos/retailers/aeon-wellness.webp" },
  { name: "Glam Beautique", src: "/photos/retailers/logo-glam-beautique.webp" },
  { name: "Sociolla", src: "/photos/retailers/sociolla.webp" },
];

const SPECIALTY: Retailer[] = [
  { name: "Kids Plaza", src: "/photos/retailers/logo-kids-plaza.webp" },
  { name: "Bibo Mart", src: "/photos/retailers/logo-bibo-mart-compressed.webp" },
  { name: "Con Cưng", src: "/photos/retailers/logo-con-cung.webp" },
  { name: "Avakids", src: "/photos/retailers/avakids-logo.webp" },
  { name: "Kohnan", src: "/photos/retailers/logo-kohnan.webp" },
];

const CHANNELS: Array<{ label: string; items: Retailer[] }> = [
  { label: "Convenience", items: CONVENIENCE },
  { label: "Supermarket & Hypermarket", items: SUPERMARKET },
  { label: "Health & Beauty", items: HEALTH_BEAUTY },
  { label: "Mom, Baby & Specialty", items: SPECIALTY },
];

export function RetailerWall() {
  return (
    <section
      aria-labelledby="retailer-wall-heading"
      className="bg-paper px-6 py-[clamp(96px,11vw,140px)] sm:px-10"
    >
      <div className="mx-auto flex max-w-[1300px] flex-col gap-12">
        <div className="flex flex-col gap-6">
          <Eyebrow tone="gold">Where to find us</Eyebrow>
          <div id="retailer-wall-heading">
            <DisplayHeading level={2} className="max-w-[22ch]">
              Our brands sit on the shelves of *every major* chain.
            </DisplayHeading>
          </div>
          <p className="max-w-[60ch] text-[17px] leading-[1.55] text-muted">
            Modern-trade partnerships across convenience, supermarket, pharmacy,
            and specialty retail — the doorway from our warehouses to shoppers
            nationwide.
          </p>
        </div>

        <div className="flex flex-col gap-[clamp(56px,7vw,96px)]">
          {CHANNELS.map((channel) => (
            <div key={channel.label} className="flex flex-col gap-6">
              <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-green">
                {channel.label}
              </span>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:grid-cols-5 lg:gap-6">
                {channel.items.map((r) => (
                  <li
                    key={r.src}
                    className="group flex aspect-[5/3] items-center justify-center rounded-sm bg-paper p-5 ring-1 ring-line/70 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:ring-gold/60 motion-safe:hover:scale-[1.05] motion-safe:focus-within:scale-[1.05] hover:shadow-[0_12px_28px_-16px_oklch(0.42_0.025_158/0.28)] sm:p-6"
                  >
                    <Image
                      src={r.src}
                      alt={`${r.name} logo`}
                      width={200}
                      height={88}
                      sizes="(min-width: 1024px) 180px, (min-width: 640px) 22vw, 40vw"
                      className="max-h-[72px] w-auto object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
