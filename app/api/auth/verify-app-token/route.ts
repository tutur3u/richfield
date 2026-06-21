import { getRichfieldApiBaseUrl, getRichfieldAppId, getRichfieldAppSecret, getRichfieldWorkspaceId } from "@/lib/richfield-config";
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

async function exchangeCrossAppToken(token: string) {
  const response = await fetch(`${normalizeApiBaseUrl()}/auth/app-token/exchange`, {
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

    const session = createRichfieldSessionFromExchangePayload(
      await exchangeCrossAppToken(token),
    );
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: error instanceof TokenExchangeError ? error.status : 500 },
    );
  }
}
