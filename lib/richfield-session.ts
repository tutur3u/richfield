import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import {
  getRichfieldApiBaseUrl,
  getRichfieldAppId,
  getRichfieldAppSecret,
  getRichfieldWorkspaceId,
} from "@/lib/richfield-config";
import { fetchWithRichfieldTimeout } from "@/lib/richfield-fetch";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

const RICHFIELD_SESSION_COOKIE = "richfield_admin_session";
const SESSION_VERSION = "v1";
const RICHFIELD_ADMIN_SCOPES = ["external-projects:*"] as const;
const SESSION_VALIDATION_CACHE_MS = 30_000;
const sessionValidationCache = new Map<
  string,
  { expiresAt: number; session: RichfieldAdminSession }
>();

export type RichfieldAdminSession = {
  accessToken: string;
  app: {
    name: string;
  };
  expiresAt: string;
  refreshEarlySeconds?: number;
  refreshExpiresAt?: string;
  refreshToken?: string;
  tokenType: "Bearer";
  workspaceId: string;
  user: {
    email: string | null;
    id: string;
  };
};

export type RichfieldSessionReadState =
  | {
      session: RichfieldAdminSession;
      status: "authenticated";
    }
  | {
      session: RichfieldAdminSession;
      status: "refreshable";
    }
  | {
      session: null;
      status: "unauthenticated";
    };

export type RichfieldAppTokenExchangeResponse = {
  accessToken?: string;
  app?: {
    name?: string;
  };
  error?: string;
  expiresAt?: string;
  refreshEarlySeconds?: number;
  refreshExpiresAt?: string;
  refreshToken?: string;
  tokenType?: string;
  workspaceId?: string | null;
  user?: {
    email?: string | null;
    id?: string;
  };
};

function getSessionSecret() {
  const secret = process.env.RICHFIELD_SESSION_SECRET ?? process.env.RICHFIELD_APP_SECRET;

  if (!secret?.trim()) {
    throw new Error("[richfield] Missing RICHFIELD_SESSION_SECRET or RICHFIELD_APP_SECRET.");
  }

  return createHash("sha256").update(secret.trim()).digest();
}

function encode(value: Buffer) {
  return value.toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url");
}

function readTimestamp(value: string | null | undefined) {
  if (!value) return null;

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function isAccessTokenCurrent(session: Pick<RichfieldAdminSession, "expiresAt">) {
  const expiresAt = readTimestamp(session.expiresAt);
  return expiresAt !== null && expiresAt > Date.now();
}

function isRefreshTokenCurrent(
  session: Pick<RichfieldAdminSession, "refreshExpiresAt" | "refreshToken">,
) {
  const expiresAt = readTimestamp(session.refreshExpiresAt);
  return Boolean(session.refreshToken) && expiresAt !== null && expiresAt > Date.now();
}

function getSessionCookieExpiresAt(session: RichfieldAdminSession) {
  const refreshExpiresAt = readTimestamp(session.refreshExpiresAt);
  const accessExpiresAt = readTimestamp(session.expiresAt);
  const expiresAt = Math.max(refreshExpiresAt ?? 0, accessExpiresAt ?? 0);

  return new Date(expiresAt || Date.now());
}

function getRichfieldSessionCookieOptions(session: RichfieldAdminSession) {
  return {
    expires: getSessionCookieExpiresAt(session),
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

function sealSession(session: RichfieldAdminSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getSessionSecret(), iv);
  const plaintext = Buffer.from(JSON.stringify(session), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [SESSION_VERSION, encode(iv), encode(tag), encode(ciphertext)].join(".");
}

function unsealSession(value: string): RichfieldAdminSession | null {
  const [version, encodedIv, encodedTag, encodedCiphertext] = value.split(".");

  if (version !== SESSION_VERSION || !encodedIv || !encodedTag || !encodedCiphertext) {
    return null;
  }

  try {
    const decipher = createDecipheriv("aes-256-gcm", getSessionSecret(), decode(encodedIv));
    decipher.setAuthTag(decode(encodedTag));
    const plaintext = Buffer.concat([
      decipher.update(decode(encodedCiphertext)),
      decipher.final(),
    ]).toString("utf8");
    const session = JSON.parse(plaintext) as RichfieldAdminSession;

    if (!session.accessToken || !session.user?.id || !session.expiresAt || !session.workspaceId) {
      return null;
    }

    if (!isAccessTokenCurrent(session) && !isRefreshTokenCurrent(session)) {
      return null;
    }

    if (session.workspaceId !== getRichfieldWorkspaceId()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function createRichfieldSessionFromExchangePayload(
  payload: RichfieldAppTokenExchangeResponse,
  fallback?: RichfieldAdminSession,
): RichfieldAdminSession {
  const workspaceId = payload.workspaceId ?? fallback?.workspaceId;
  const userId = payload.user?.id ?? fallback?.user.id;

  if (!payload.accessToken || !payload.expiresAt || !userId || !workspaceId) {
    throw new Error("Invalid Tuturuuu app token exchange response.");
  }

  return {
    accessToken: payload.accessToken,
    app: {
      name: payload.app?.name ?? fallback?.app.name ?? getRichfieldAppId(),
    },
    expiresAt: payload.expiresAt,
    refreshEarlySeconds:
      typeof payload.refreshEarlySeconds === "number" &&
      Number.isFinite(payload.refreshEarlySeconds)
        ? payload.refreshEarlySeconds
        : fallback?.refreshEarlySeconds,
    refreshExpiresAt: payload.refreshExpiresAt ?? fallback?.refreshExpiresAt,
    refreshToken: payload.refreshToken ?? fallback?.refreshToken,
    tokenType: "Bearer",
    workspaceId,
    user: {
      email: payload.user?.email ?? fallback?.user.email ?? null,
      id: userId,
    },
  };
}

function getRichfieldSessionValidationUrl(workspaceId: string) {
  const apiBaseUrl = getRichfieldApiBaseUrl().replace(/\/+$/, "");
  return `${apiBaseUrl}/workspaces/${encodeURIComponent(workspaceId)}/external-projects/summary`;
}

function getRichfieldAppTokenExchangeUrl() {
  const apiBaseUrl = getRichfieldApiBaseUrl().replace(/\/+$/, "");
  return `${apiBaseUrl}/auth/app-token/exchange`;
}

async function validateRichfieldSession(session: RichfieldAdminSession) {
  const cacheKey = `${session.workspaceId}:${session.accessToken}`;
  const cached = sessionValidationCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.session;
  }

  try {
    const response = await fetchWithRichfieldTimeout(getRichfieldSessionValidationUrl(session.workspaceId), {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `${session.tokenType} ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      sessionValidationCache.delete(cacheKey);
      return null;
    }

    sessionValidationCache.set(cacheKey, {
      expiresAt: Date.now() + SESSION_VALIDATION_CACHE_MS,
      session,
    });

    return session;
  } catch {
    sessionValidationCache.delete(cacheKey);
    return null;
  }
}

async function refreshRichfieldSession(session: RichfieldAdminSession) {
  if (!isRefreshTokenCurrent(session)) {
    return null;
  }

  try {
    const response = await fetchWithRichfieldTimeout(getRichfieldAppTokenExchangeUrl(), {
      body: JSON.stringify({
        appId: getRichfieldAppId(),
        appSecret: getRichfieldAppSecret(),
        refreshToken: session.refreshToken,
        requestedScopes: [...RICHFIELD_ADMIN_SCOPES],
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
      return null;
    }

    const payload = (await response.json().catch(() => null)) as
      | RichfieldAppTokenExchangeResponse
      | null;

    if (!payload) {
      return null;
    }

    return createRichfieldSessionFromExchangePayload(payload, session);
  } catch {
    return null;
  }
}

async function getStoredRichfieldSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(RICHFIELD_SESSION_COOKIE)?.value;
  return value ? unsealSession(value) : null;
}

export async function refreshRichfieldSessionFromCookies() {
  const session = await getStoredRichfieldSession();

  if (!session) {
    return null;
  }

  const refreshed = await refreshRichfieldSession(session);

  if (!refreshed) {
    return null;
  }

  const validated = await validateRichfieldSession(refreshed);

  if (!validated) {
    return null;
  }

  return validated;
}

export async function getRichfieldSessionReadStateFromCookies(): Promise<RichfieldSessionReadState> {
  const session = await getStoredRichfieldSession();

  if (!session) {
    return { session: null, status: "unauthenticated" };
  }

  if (!isAccessTokenCurrent(session)) {
    return isRefreshTokenCurrent(session)
      ? { session, status: "refreshable" }
      : { session: null, status: "unauthenticated" };
  }

  const validated = await validateRichfieldSession(session);

  if (validated) {
    return { session: validated, status: "authenticated" };
  }

  return isRefreshTokenCurrent(session)
    ? { session, status: "refreshable" }
    : { session: null, status: "unauthenticated" };
}

export async function getRichfieldSessionFromCookies() {
  const state = await getRichfieldSessionReadStateFromCookies();
  return state.status === "authenticated" ? state.session : null;
}

export function setRichfieldSessionCookie(response: NextResponse, session: RichfieldAdminSession) {
  response.cookies.set(RICHFIELD_SESSION_COOKIE, sealSession(session), {
    ...getRichfieldSessionCookieOptions(session),
  });
}

export function clearRichfieldSessionCookie(response: NextResponse) {
  response.cookies.set(RICHFIELD_SESSION_COOKIE, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
