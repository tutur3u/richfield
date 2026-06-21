import type { Metadata } from "next";
import { RichfieldAdminLoginPanel } from "@/components/admin/RichfieldAdminLoginPanel";
import { getRichfieldCentralizedLoginHref } from "../login-link";
import { resolveRichfieldAdminTargetKey } from "@/lib/richfield-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Admin Login",
	description: "Tuturuuu login for the InkedByRichfield dashboard.",
};

export default async function AdminLoginPage({
	searchParams,
}: {
	searchParams?: Promise<{ next?: string }>;
}) {
	const params = await searchParams;
	const targetKey = resolveRichfieldAdminTargetKey(params?.next);

	return (
		<RichfieldAdminLoginPanel
			loginHref={await getRichfieldCentralizedLoginHref(targetKey)}
		/>
	);
}
