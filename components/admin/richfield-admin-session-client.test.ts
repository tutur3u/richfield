import { afterEach, describe, expect, test, vi } from "vitest";
import {
  adminFetch,
  getRichfieldAdminSessionRefreshDelayMs,
  refreshRichfieldAdminSession,
} from "./richfield-admin-session-client";

const originalFetch = globalThis.fetch;

describe("Richfield admin session client", () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test("caps large refresh lead values so short-lived tokens do not loop", () => {
    const now = new Date("2026-06-12T00:00:00.000Z").getTime();
    const expiresAt = new Date(now + 60_000).toISOString();

    expect(
      getRichfieldAdminSessionRefreshDelayMs({
        expiresAt,
        now,
        refreshEarlySeconds: 900,
      }),
    ).toBe(30_000);
  });

  test("uses a fallback delay for invalid expiry timestamps", () => {
    expect(
      getRichfieldAdminSessionRefreshDelayMs({
        expiresAt: "not-a-date",
        now: 0,
      }),
    ).toBe(5 * 60 * 1000);
  });

  test("de-dupes concurrent refresh requests", async () => {
    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    globalThis.fetch = vi.fn(async (input, init) => {
      calls.push({ init, input });
      return Response.json({
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
        refreshEarlySeconds: 900,
        valid: true,
      });
    }) as typeof fetch;

    const [first, second] = await Promise.all([
      refreshRichfieldAdminSession(),
      refreshRichfieldAdminSession(),
    ]);

    expect(first?.valid).toBe(true);
    expect(second?.valid).toBe(true);
    expect(calls).toHaveLength(1);
    expect(String(calls[0]?.input)).toBe("/api/auth/session/refresh");
  });

  test("retries admin requests once after a successful refresh", async () => {
    const calls: Array<{ init?: RequestInit; input: RequestInfo | URL }> = [];
    globalThis.fetch = vi.fn(async (input, init) => {
      calls.push({ init, input });

      if (String(input) === "/api/auth/session/refresh") {
        return Response.json({
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          valid: true,
        });
      }

      if (calls.filter((call) => String(call.input) === "/api/admin/content/brands").length === 1) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      return Response.json({ items: [] });
    }) as typeof fetch;

    const response = await adminFetch("/api/admin/content/brands", {
      cache: "no-store",
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ items: [] });
    expect(calls.map((call) => String(call.input))).toEqual([
      "/api/admin/content/brands",
      "/api/auth/session/refresh",
      "/api/admin/content/brands",
    ]);
    expect(calls[0]?.init?.credentials).toBe("same-origin");
    expect(calls[2]?.init?.credentials).toBe("same-origin");
  });
});
