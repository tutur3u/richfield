import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { StorageAnalytics } from "tuturuuu";
import { getRichfieldApiBaseUrl, getRichfieldWorkspaceId } from "./richfield-config";
import { getRichfieldSessionFromCookies } from "./richfield-session";

export type RichfieldStorageAnalyticsState =
  | { data: StorageAnalytics; status: "ready" }
  | { message: string; status: "unavailable" };

type StorageAnalyticsResponse = {
  data?: StorageAnalytics;
};

const unavailableMessage = "Storage details are not available right now.";

function isStorageFile(value: unknown): value is StorageAnalytics["largestFile"] {
  if (value === null) return true;
  if (!value || typeof value !== "object") return false;

  const file = value as Record<string, unknown>;
  return (
    typeof file.name === "string" &&
    typeof file.size === "number" &&
    typeof file.createdAt === "string"
  );
}

function isStorageAnalytics(value: unknown): value is StorageAnalytics {
  if (!value || typeof value !== "object") return false;

  const analytics = value as Record<string, unknown>;
  return (
    typeof analytics.totalSize === "number" &&
    typeof analytics.fileCount === "number" &&
    typeof analytics.storageLimit === "number" &&
    typeof analytics.usagePercentage === "number" &&
    isStorageFile(analytics.largestFile) &&
    isStorageFile(analytics.smallestFile)
  );
}

export async function getRichfieldStorageAnalytics(
  accessToken: string,
): Promise<RichfieldStorageAnalyticsState> {
  try {
    const apiBaseUrl = getRichfieldApiBaseUrl().replace(/\/+$/, "");
    const workspaceId = getRichfieldWorkspaceId();
    const response = await fetch(
      `${apiBaseUrl}/workspaces/${encodeURIComponent(
        workspaceId,
      )}/external-projects/storage-analytics`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      return {
        message: unavailableMessage,
        status: "unavailable",
      };
    }

    const payload = (await response.json().catch(() => null)) as
      | StorageAnalyticsResponse
      | null;
    const data = payload?.data;

    if (!isStorageAnalytics(data)) {
      return {
        message: unavailableMessage,
        status: "unavailable",
      };
    }

    return {
      data,
      status: "ready",
    };
  } catch {
    return {
      message: unavailableMessage,
      status: "unavailable",
    };
  }
}

function getRichfieldAdminSession() {
  return getRichfieldSessionFromCookies();
}

function revalidateRichfieldContent() {
  revalidatePath("/", "layout");
  revalidatePath("/blog");
  revalidatePath("/contact");
  revalidatePath("/gallery");
  revalidatePath("/shop");
  revalidatePath("/worlds/[slug]", "page");
}

function getPlatformStorageUrl(request: Request) {
  const incomingUrl = new URL(request.url);
  const apiBaseUrl = getRichfieldApiBaseUrl().replace(/\/+$/, "");
  const workspaceId = getRichfieldWorkspaceId();
  const url = new URL(
    `${apiBaseUrl}/workspaces/${encodeURIComponent(workspaceId)}/external-projects/storage`,
  );

  for (const [key, value] of incomingUrl.searchParams) {
    url.searchParams.append(key, value);
  }

  return url;
}

async function readPlatformPayload(response: Response) {
  return (await response.json().catch(async () => ({
    error: (await response.text().catch(() => "")) || "Storage request failed",
  }))) as unknown;
}

export async function forwardStorageRequest(request: Request, method: string) {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };
  let body: BodyInit | undefined;

  if (method !== "GET") {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      body = await request.text();
      headers["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(getPlatformStorageUrl(request), {
    body,
    cache: "no-store",
    headers,
    method,
  });
  const payload = await readPlatformPayload(response);

  if (response.ok && method !== "GET") {
    revalidateRichfieldContent();
  }

  return NextResponse.json(payload, { status: response.status });
}
