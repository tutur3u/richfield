// Phosphor Icons wrapper — `duotone` weight gives the channel chips a
// subtle editorial two-tone depth that flat libraries (lucide, heroicons)
// can't match. Re-exported here so the rest of the app uses one centralized
// import surface; swap to a different family by editing this file only.
import {
  FacebookLogo,
  Phone,
  EnvelopeSimple,
  MapPin,
  ChatCircleDots,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon, IconProps } from "@phosphor-icons/react";

function makeIcon(C: Icon, defaultWeight: IconProps["weight"] = "duotone") {
  function Wrapped({
    className = "h-5 w-5",
    weight = defaultWeight,
    ...rest
  }: IconProps) {
    return <C className={className} weight={weight} {...rest} />;
  }
  Wrapped.displayName = `Wrapped(${C.displayName ?? "Icon"})`;
  return Wrapped;
}

// FacebookLogo `duotone` doesn't render well on the brand-blue chip — use
// `fill` so the white silhouette stays crisp.
export const FacebookIcon = makeIcon(FacebookLogo, "fill");
export const PhoneIcon = makeIcon(Phone);
export const EmailIcon = makeIcon(EnvelopeSimple);
export const MapPinIcon = makeIcon(MapPin);
export const ZaloIcon = makeIcon(ChatCircleDots);
