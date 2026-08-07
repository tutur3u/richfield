import { cache } from "react";
import {
  buildRichfieldContent,
  getDefaultRichfieldContent,
  type RichfieldDeliveryPayload,
} from "./richfield-content";
import { getOptionalRichfieldWorkspaceId, getRichfieldApiBaseUrl } from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";
import { RICHFIELD_CONTENT_TAG } from "./richfield-revalidation";
import { DEFAULT_LOCALE, type Locale } from "./locale";

const DELIVERY_REVALIDATE_SECONDS = 60;

async function fetchDeliveryPayload() {
  const workspaceId = getOptionalRichfieldWorkspaceId();

  if (!workspaceId) {
    return null;
  }

  const apiBaseUrl = getRichfieldApiBaseUrl();
  const response = await fetchWithRichfieldTimeout(
    `${apiBaseUrl.replace(/\/+$/, "")}/workspaces/${encodeURIComponent(
      workspaceId,
    )}/external-projects/delivery`,
    {
      cache: "force-cache",
      next: {
        // The tag is what a publish invalidates; the interval is only the
        // backstop for content changed outside the dashboard.
        revalidate: DELIVERY_REVALIDATE_SECONDS,
        tags: [RICHFIELD_CONTENT_TAG],
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

export async function getUncachedRichfieldContent(locale: Locale = DEFAULT_LOCALE) {
  try {
    const payload = await fetchDeliveryPayload();

    if (!payload) {
      return getDefaultRichfieldContent(locale);
    }

    return buildRichfieldContent(payload.delivery, {
      apiBaseUrl: payload.apiBaseUrl,
      locale,
    });
  } catch {
    return getDefaultRichfieldContent(locale);
  }
}

export const getRichfieldContent = cache(getUncachedRichfieldContent);
