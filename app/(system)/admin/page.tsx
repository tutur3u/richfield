import { redirect } from "next/navigation";
import { DEFAULT_ADMIN_SECTION_SLUG } from "@/lib/admin/sections";

export const dynamic = "force-dynamic";

/**
 * /admin is an entry point now, not a screen.
 *
 * Every surface lives at its own URL and the dashboard body renders inside the
 * section shell, so landing here should take you to a real section rather than
 * to a separate, thirteenth copy of the tool — which is what left the redesign
 * invisible to anyone who simply opened /admin. News is the default because it
 * is what gets edited most.
 */
export default function AdminIndexPage() {
  redirect(`/admin/${DEFAULT_ADMIN_SECTION_SLUG}`);
}
