import { getRichfieldApiBaseUrl, getRichfieldAppId, getRichfieldAppSecret, getRichfieldWorkspaceId } from "@/lib/richfield-config";
import { fetchWithRichfieldTimeout, isRichfieldTimeoutError } from "@/lib/richfield-fetch";
import {
  createRichfieldSessionFromExchangePayload,
  setRichfieldSessionCookie,
  type RichfieldAppTokenExchangeResponse,
} from "@/lib/richfield-session";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

class TokenExchangeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function normalizeApiBaseUrl() {
  return getRichfieldApiBaseUrl().replace(/\/+$/, "");
}

async function readExchangeError(response: Response) {
  const fallback = `Tuturuuu app token exchange failed with status ${response.status}`;
  const payload = (await response.json().catch(() => null)) as
    | RichfieldAppTokenExchangeResponse
    | null;

  return payload?.error || fallback;
}

/**
 * A pending workspace invitation is not an authentication failure.
 *
 * Someone invited to the Richfield workspace but not yet a member gets a 403
 * from the exchange. Reporting that as "we could not sign you in" strands them
 * at a dead end with an invitation sitting unaccepted — so the invitation is
 * handed back to the client instead, with the token needed to accept it.
 */
type RichfieldPendingInvitation = {
  code: "PENDING_WORKSPACE_INVITE";
  invitation?: unknown;
  invitationActionToken: string;
  workspaceId: string;
};

function readPendingInvitation(
  payload: unknown,
): RichfieldPendingInvitation | null {
  if (!payload || typeof payload !== "object") return null;

  const body = payload as Record<string, unknown>;

  if (
    body.code !== "PENDING_WORKSPACE_INVITE" ||
    typeof body.invitationActionToken !== "string" ||
    typeof body.workspaceId !== "string"
  ) {
    return null;
  }

  return {
    code: "PENDING_WORKSPACE_INVITE",
    invitation: body.invitation,
    invitationActionToken: body.invitationActionToken,
    workspaceId: body.workspaceId,
  };
}

async function exchangeCrossAppToken(token: string) {
  const response = await fetchWithRichfieldTimeout(`${normalizeApiBaseUrl()}/auth/app-token/exchange`, {
    body: JSON.stringify({
      appId: getRichfieldAppId(),
      appSecret: getRichfieldAppSecret(),
      requestedScopes: ["external-projects:*"],
      token,
      workspaceId: getRichfieldWorkspaceId(),
    }),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    const payload = await response.clone().json().catch(() => null);
    const pendingInvitation = readPendingInvitation(payload);

    if (pendingInvitation) {
      return { pendingInvitation };
    }

    throw new TokenExchangeError(await readExchangeError(response), response.status);
  }

  return (await response.json()) as RichfieldAppTokenExchangeResponse;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
    const token = typeof body?.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json({ error: "Missing required parameter: token" }, { status: 400 });
    }

    const exchange = await exchangeCrossAppToken(token);

    // Invited but not yet a member: hand the invitation to the client so it can
    // be accepted here, rather than reporting a sign-in failure.
    if ("pendingInvitation" in exchange) {
      return NextResponse.json(
        { pendingInvitation: exchange.pendingInvitation, valid: false },
        { status: 200 },
      );
    }

    const session = createRichfieldSessionFromExchangePayload(exchange);
    const response = NextResponse.json({
      expiresAt: session.expiresAt,
      refreshEarlySeconds: session.refreshEarlySeconds,
      userId: session.user.id,
      valid: true,
    });

    setRichfieldSessionCookie(response, session);
    return response;
  } catch (error) {
    console.error("[richfield:auth] app token exchange failed", error);
    if (isRichfieldTimeoutError(error)) {
      return NextResponse.json(
        { error: "Tuturuuu app token exchange timed out" },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof TokenExchangeError ? error.status : 500 },
    );
  }
}
