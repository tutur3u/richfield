import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { RichfieldAdminLoginPanel } from "@/components/admin/RichfieldAdminLoginPanel";
import { getRichfieldCentralizedLoginHref } from "../login-link";
import { ADMIN_LOCALE_COOKIE, toAdminLocale } from "@/lib/admin/locales";
import { resolveRichfieldAdminTargetKey } from "@/lib/richfield-config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
	const locale = toAdminLocale(
		(await cookies()).get(ADMIN_LOCALE_COOKIE)?.value,
	);
	const t = await getTranslations({ locale, namespace: "admin.metadata" });

	return {
		title: t("loginTitle"),
		description: t("loginDescription"),
	};
}

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
