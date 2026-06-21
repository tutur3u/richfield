import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { NextResponse } from "next/server";
import type { RichfieldAdminSession } from "./richfield-session";

let sessionCookieValue: string | null = null;

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      sessionCookieValue ? { name, value: sessionCookieValue } : undefined,
  }),
}));

const originalFetch = globalThis.fetch;

function createSession(
  overrides: Partial<RichfieldAdminSession> = {},
): RichfieldAdminSession {
  return {
    accessToken: "app-token",
    app: { name: "richfield" },
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    tokenType: "Bearer",
    user: { email: "admin@example.com", id: "user-1" },
    workspaceId: "ws-richfield",
    ...overrides,
  };
}

function readSessionCookieValue(response: NextResponse) {
  const setCookie = response.headers.get("set-cookie");
  expect(setCookie).toContain("richfield_admin_session=");
  return setCookie?.split(";")[0]?.slice("richfield_admin_session=".length) ?? "";
}

describe("Richfield session validation", () => {
  beforeEach(() => {
    process.env.TUTURUUU_API_BASE_URL = "https://tuturuuu.localhost/api/v1";
    process.env.RICHFIELD_APP_SECRET = "app-secret";
    process.env.TUTURUUU_RICHFIELD_WORKSPACE_ID = "ws-richfield";
    process.env.RICHFIELD_SESSION_SECRET = "session-secret";
    sessionCookieValue = null;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.TUTURUUU_API_BASE_URL;
    delete process.env.RICHFIELD_APP_SECRET;
    delete process.env.TUTURUUU_RICHFIELD_WORKSPACE_ID;
    delete process.env.RICHFIELD_SESSION_SECRET;
    sessionCookieValue = null;
  });

  for (const status of [401, 403, 404] as const) {
    test(`rejects stored sessions when platform revalidation returns ${status}`, async () => {
      const { getRichfieldSessionFromCookies, setRichfieldSessionCookie } =
        await import("./richfield-session");
      const response = NextResponse.json({});
      setRichfieldSessionCookie(response, createSession());
      sessionCookieValue = readSessionCookieValue(response);

      const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
      globalThis.fetch = (async (input, init) => {
        calls.push({ init, input });
        return Response.json({ error: "Invalid session" }, { status });
      }) as typeof fetch;

      await expect(getRichfieldSessionFromCookies()).resolves.toBeNull();
      expect(calls).toHaveLength(1);
      expect(String(calls[0]?.input)).toBe(
        "https://tuturuuu.localhost/api/v1/workspaces/ws-richfield/external-projects/summary",
      );
      expect(calls[0]?.init?.headers).toMatchObject({
        Accept: "application/json",
        Authorization: "Bearer app-token",
      });
    });
  }

  test("reports expired access with a valid refresh token as refreshable", async () => {
    const { getRichfieldSessionReadStateFromCookies, setRichfieldSessionCookie } =
      await import("./richfield-session");
    const response = NextResponse.json({});
    setRichfieldSessionCookie(
      response,
      createSession({
        expiresAt: new Date(Date.now() - 1_000).toISOString(),
        refreshEarlySeconds: 900,
        refreshExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        refreshToken: "refresh-token",
      }),
    );
    sessionCookieValue = readSessionCookieValue(response);

    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    globalThis.fetch = (async (input, init) => {
      calls.push({ init, input });
      return Response.json({ ok: true });
    }) as typeof fetch;

    const state = await getRichfieldSessionReadStateFromCookies();

    expect(state.status).toBe("refreshable");
    expect(state.session?.refreshToken).toBe("refresh-token");
    expect(calls).toHaveLength(0);
  });

  test("refreshes stored sessions through the explicit refresh helper", async () => {
    const { refreshRichfieldSessionFromCookies, setRichfieldSessionCookie } =
      await import("./richfield-session");
    const response = NextResponse.json({});
    setRichfieldSessionCookie(
      response,
      createSession({
        expiresAt: new Date(Date.now() - 1_000).toISOString(),
        refreshEarlySeconds: 900,
        refreshExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
        refreshToken: "refresh-token",
      }),
    );
    sessionCookieValue = readSessionCookieValue(response);

    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    globalThis.fetch = (async (input, init) => {
      calls.push({ init, input });

      if (String(input).endsWith("/auth/app-token/exchange")) {
        return Response.json({
          accessToken: "new-app-token",
          app: { name: "richfield" },
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          refreshEarlySeconds: 900,
          refreshExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
          refreshToken: "new-refresh-token",
          tokenType: "Bearer",
          user: { email: "admin@example.com", id: "user-1" },
          workspaceId: "ws-richfield",
        });
      }

      return Response.json({ ok: true });
    }) as typeof fetch;

    const session = await refreshRichfieldSessionFromCookies();

    expect(session?.accessToken).toBe("new-app-token");
    expect(session?.refreshToken).toBe("new-refresh-token");
    expect(calls).toHaveLength(2);
    expect(String(calls[0]?.input)).toBe(
      "https://tuturuuu.localhost/api/v1/auth/app-token/exchange",
    );
    expect(JSON.parse(calls[0]?.init?.body as string)).toMatchObject({
      appId: "richfield",
      appSecret: "app-secret",
      refreshToken: "refresh-token",
      requestedScopes: ["external-projects:*"],
      workspaceId: "ws-richfield",
    });
    expect(calls[1]?.init?.headers).toMatchObject({
      Accept: "application/json",
      Authorization: "Bearer new-app-token",
    });
  });
});
