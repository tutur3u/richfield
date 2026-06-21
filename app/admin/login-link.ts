import { headers } from "next/headers";
import {
	buildRichfieldCentralizedLoginUrl,
	type RichfieldAdminTargetKey,
} from "@/lib/richfield-config";

function getRequestOrigin(headersList: Headers) {
	const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

	if (!host) {
		return null;
	}

	const protocol =
		headersList.get("x-forwarded-proto") ??
		(host.startsWith("localhost") || host.startsWith("127.0.0.1")
			? "http"
			: "https");

	return `${protocol}://${host}`;
}

function getRichfieldAdminNextUrl(targetKey: RichfieldAdminTargetKey) {
	return targetKey === "dashboard" ? "/admin" : `/admin?target=${targetKey}`;
}

export async function getRichfieldCentralizedLoginHref(
	targetKey: RichfieldAdminTargetKey,
) {
	const requestOrigin = getRequestOrigin(await headers());

	return buildRichfieldCentralizedLoginUrl({
		...(requestOrigin ? { appBaseUrl: requestOrigin } : {}),
		nextUrl: getRichfieldAdminNextUrl(targetKey),
	});
}
