import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-ins for the next/link + next/navigation APIs. `Link`
// prefixes hrefs for non-default locales automatically; `usePathname` returns
// the pathname without its locale prefix.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
