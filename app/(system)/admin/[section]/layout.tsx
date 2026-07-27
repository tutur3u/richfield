import { AdminShell } from "@/components/admin/AdminShell";
import { RichfieldAdminLoginPanel } from "@/components/admin/RichfieldAdminLoginPanel";
import { RichfieldAdminSessionRestorer } from "@/components/admin/RichfieldAdminSessionRestorer";
import { getRichfieldAdminSessionReadState } from "@/lib/richfield-admin-api";
import { getRichfieldCentralizedLoginHref } from "../login-link";

/**
 * Chrome for every dashboard section.
 *
 * A layout rather than something each page renders: Next keeps it mounted
 * across section navigations, so the sidebar and theme survive moving between
 * News and Careers instead of being torn down and rebuilt each time.
 *
 * The signed-out screens are returned from *here*, not from the page. A layout
 * wraps whatever its page returns, so a page-level login panel rendered inside
 * the dashboard chrome — sidebar, sign-out button and all — behind a sign-in
 * card. Deciding access at the layer that owns the chrome is what keeps the
 * two states from being drawn on top of each other.
 */
export default async function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionState = await getRichfieldAdminSessionReadState();

  if (sessionState.status === "unauthenticated") {
    return (
      <RichfieldAdminLoginPanel
        loginHref={await getRichfieldCentralizedLoginHref("dashboard")}
      />
    );
  }

  if (sessionState.status === "refreshable") {
    return (
      <RichfieldAdminSessionRestorer
        loginHref={await getRichfieldCentralizedLoginHref("dashboard")}
      />
    );
  }

  return (
    <AdminShell userEmail={sessionState.session.user.email}>
      {children}
    </AdminShell>
  );
}
