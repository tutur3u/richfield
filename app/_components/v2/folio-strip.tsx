import Image from "next/image";

type Props = {
  className?: string;
};

export function FolioStrip({ className = "" }: Props) {
  return (
    <div className={`flex w-full items-center gap-6 ${className}`}>
      <Image
        src="/photos/logos/richfield.webp"
        alt="Richfield Group"
        width={120}
        height={110}
        priority
        className="h-[clamp(46px,4.4vw,56px)] w-auto shrink-0 object-contain [filter:drop-shadow(0_2px_6px_rgb(0_0_0_/_0.55))]"
      />
      <span aria-hidden className="v2-rule-gold hidden flex-1 md:block" />
    </div>
  );
}
