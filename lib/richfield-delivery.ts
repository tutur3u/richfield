import { cache } from "react";
import {
  buildRichfieldContent,
  DEFAULT_RICHFIELD_CONTENT,
  type RichfieldDeliveryPayload,
} from "./richfield-content";
import { getOptionalRichfieldWorkspaceId, getRichfieldApiBaseUrl } from "./richfield-config";

const DELIVERY_REVALIDATE_SECONDS = 60;

async function fetchDeliveryPayload() {
  const workspaceId = getOptionalRichfieldWorkspaceId();

  if (!workspaceId) {
    return null;
  }

  const apiBaseUrl = getRichfieldApiBaseUrl();
  const response = await fetch(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/delivery`,
    {
      cache: "force-cache",
      next: {
        revalidate: DELIVERY_REVALIDATE_SECONDS,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Richfield delivery failed with status ${response.status}`);
  }

  return {
    apiBaseUrl,
    delivery: (await response.json()) as RichfieldDeliveryPayload,
  };
}

export async function getUncachedRichfieldContent() {
  try {
    const payload = await fetchDeliveryPayload();

    if (!payload) {
      return DEFAULT_RICHFIELD_CONTENT;
    }

    return buildRichfieldContent(payload.delivery, {
      apiBaseUrl: payload.apiBaseUrl,
    });
  } catch {
    return DEFAULT_RICHFIELD_CONTENT;
  }
}

export const getRichfieldContent = cache(getUncachedRichfieldContent);
