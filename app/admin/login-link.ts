import {
	buildRichfieldCentralizedLoginUrl,
	type RichfieldAdminTargetKey,
} from "@/lib/richfield-config";

function getRichfieldAdminNextUrl(targetKey: RichfieldAdminTargetKey) {
	return targetKey === "dashboard" ? "/admin" : `/admin?target=${targetKey}`;
}

export async function getRichfieldCentralizedLoginHref(
	targetKey: RichfieldAdminTargetKey,
) {
	return buildRichfieldCentralizedLoginUrl({
		nextUrl: getRichfieldAdminNextUrl(targetKey),
	});
}
