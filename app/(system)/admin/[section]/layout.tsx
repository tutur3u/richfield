import { AdminShell } from "@/components/admin/AdminShell";
import { getRichfieldAdminSessionReadState } from "@/lib/richfield-admin-api";

/**
 * Chrome for every dashboard section.
 *
 * A layout rather than something each page renders: Next keeps it mounted
 * across section navigations, so the sidebar, the theme and the scroll position
 * survive moving between News and Careers instead of being torn down and
 * rebuilt each time. Scoped to [section], so the sign-in screen at /admin/login
 * is not wrapped in dashboard chrome it has no use for.
 */
export default async function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionState = await getRichfieldAdminSessionReadState();
  const email =
    sessionState.status === "authenticated"
      ? sessionState.session.user.email
      : null;

  return <AdminShell userEmail={email}>{children}</AdminShell>;
}
