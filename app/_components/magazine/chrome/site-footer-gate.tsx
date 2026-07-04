"use client";

import { usePathname } from "next/navigation";

// The site footer ends every public route, but the admin dashboard is an
// app surface, not a magazine page — hide the footer there.
export function SiteFooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return null;
  }

  return children;
}
