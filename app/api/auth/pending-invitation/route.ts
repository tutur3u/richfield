import {
  getRichfieldApiBaseUrl,
  getRichfieldAppId,
  getRichfieldAppSecret,
  getRichfieldWorkspaceId,
} from "@/lib/richfield-config";
import { fetchWithRichfieldTimeout } from "@/lib/richfield-fetch";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Accept (or decline) a pending Richfield workspace invitation.
 *
 * Someone who was invited but never joined cannot sign in — the token exchange
 * refuses them — so without this they would sit at the login screen with an
 * invitation they had no way to act on. The decision is relayed to Tuturuuu
 * with this site's app credentials; the invitation action token is single-use
 * and issued by the exchange, so it cannot be replayed.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    action?: unknown;
    invitationActionToken?: unknown;
  } | null;

  const action = body?.action === "reject" ? "reject" : "accept";
  const invitationActionToken =
    typeof body?.invitationActionToken === "string"
      ? body.invitationActionToken.trim()
      : "";

  if (!invitationActionToken) {
    return NextResponse.json(
      { error: "Missing invitation token" },
      { status: 400 },
    );
  }

  try {
    const response = await fetchWithRichfieldTimeout(
      `${getRichfieldApiBaseUrl().replace(/\/+$/, "")}/auth/app-token/invitation-decision`,
      {
        body: JSON.stringify({
          action,
          appId: getRichfieldAppId(),
          appSecret: getRichfieldAppSecret(),
          invitationActionToken,
          requestedScopes: ["external-projects:*"],
          workspaceId: getRichfieldWorkspaceId(),
        }),
        cache: "no-store",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        method: "POST",
      },
    );

    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    if (!response.ok) {
      return NextResponse.json(
        { error: payload?.error ?? "Could not update the invitation" },
        { status: response.status },
      );
    }

    return NextResponse.json({ action, ok: true });
  } catch (error) {
    console.error("[richfield:auth] invitation decision failed", error);
    return NextResponse.json(
      { error: "Could not reach Tuturuuu" },
      { status: 502 },
    );
  }
}
