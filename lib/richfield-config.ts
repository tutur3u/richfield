import { sanitizeRichfieldNextPath } from "./richfield-url-utils";

export const RICHFIELD_APP_NAME = "richfield";

export type RichfieldAdminTargetKey =
  | "dashboard"
  | "library"
  | "preview"
  | "members"
  | "settings";

type RichfieldAdminTarget = {
  actionLabel: string;
  description: string;
  key: RichfieldAdminTargetKey;
  label: string;
  pathSuffix: string;
};

export const RICHFIELD_ADMIN_TARGETS: RichfieldAdminTarget[] = [
  {
    actionLabel: "Open CMS Home",
    description: "Review workspace status and jump into the content studio.",
    key: "dashboard",
    label: "CMS Home",
    pathSuffix: "",
  },
  {
    actionLabel: "Manage Library",
    description: "Edit profile copy, writing worlds, gallery, blog, shop, and social links.",
    key: "library",
    label: "Library",
    pathSuffix: "/library",
  },
  {
    actionLabel: "Preview Delivery",
    description: "Inspect the delivered Richfield payload before publishing.",
    key: "preview",
    label: "Preview",
    pathSuffix: "/preview",
  },
  {
    actionLabel: "Manage Members",
    description: "Open CMS workspace membership and collaborator access.",
    key: "members",
    label: "Members",
    pathSuffix: "/members",
  },
  {
    actionLabel: "Open Settings",
    description: "Tune the external project binding and workspace settings.",
    key: "settings",
    label: "Settings",
    pathSuffix: "/settings",
  },
];

function isEnabled(value: string | undefined) {
  return value ? ["1", "true", "yes", "on"].includes(value.trim().toLowerCase()) : false;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getAdminDevMode() {
  return isEnabled(process.env.DEV_MODE ?? process.env.NEXT_PUBLIC_DEV_MODE);
}

function getConfiguredUrl({
  envName,
  localUrl,
  productionUrl,
}: {
  envName: string;
  localUrl: string;
  productionUrl: string;
}) {
  const configured = process.env[envName] ?? process.env[`NEXT_PUBLIC_${envName}`];

  if (configured?.trim()) {
    return trimTrailingSlash(configured.trim());
  }

  return getAdminDevMode() ? localUrl : productionUrl;
}

export function getRichfieldApiBaseUrl() {
  return (
    process.env.TUTURUUU_API_BASE_URL ??
    process.env.NEXT_PUBLIC_TUTURUUU_API_BASE_URL ??
    "https://tuturuuu.com/api/v1"
  );
}

export function getRichfieldWorkspaceId() {
  const workspaceId =
    process.env.TUTURUUU_RICHFIELD_WORKSPACE_ID ??
    process.env.NEXT_PUBLIC_TUTURUUU_RICHFIELD_WORKSPACE_ID;

  if (!workspaceId?.trim()) {
    throw new Error("[richfield] Missing TUTURUUU_RICHFIELD_WORKSPACE_ID.");
  }

  return workspaceId.trim();
}

export function getOptionalRichfieldWorkspaceId() {
  const workspaceId =
    process.env.TUTURUUU_RICHFIELD_WORKSPACE_ID ??
    process.env.NEXT_PUBLIC_TUTURUUU_RICHFIELD_WORKSPACE_ID;

  return workspaceId?.trim() || null;
}

export function getRichfieldAppId() {
  return (process.env.RICHFIELD_APP_ID ?? RICHFIELD_APP_NAME).trim().toLowerCase();
}

export function getRichfieldAppSecret() {
  const secret = process.env.RICHFIELD_APP_SECRET ?? process.env.TUTURUUU_RICHFIELD_APP_SECRET;

  if (!secret?.trim()) {
    throw new Error("[richfield] Missing RICHFIELD_APP_SECRET.");
  }

  return secret.trim();
}

export function getRichfieldCmsBaseUrl() {
  return getConfiguredUrl({
    envName: "TUTURUUU_CMS_APP_URL",
    localUrl: "http://localhost:7811",
    productionUrl: "https://cms.tuturuuu.com",
  });
}

export function getRichfieldWebAppUrl() {
  return getConfiguredUrl({
    envName: "TUTURUUU_WEB_APP_URL",
    localUrl: "http://localhost:7803",
    productionUrl: "https://tuturuuu.com",
  });
}

export function getRichfieldAppBaseUrl(requestOrigin?: string) {
  const configured =
    process.env.RICHFIELD_APP_URL ??
    process.env.NEXT_PUBLIC_RICHFIELD_APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL;

  if (configured?.trim()) {
    return trimTrailingSlash(configured.trim());
  }

  if (requestOrigin?.trim()) {
    return trimTrailingSlash(requestOrigin.trim());
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${trimTrailingSlash(process.env.VERCEL_URL.trim())}`;
  }

  return "http://localhost:3000";
}

export { sanitizeRichfieldNextPath };

export function resolveRichfieldAdminTargetKey(
  value: string | null | undefined,
): RichfieldAdminTargetKey {
  return RICHFIELD_ADMIN_TARGETS.some((target) => target.key === value)
    ? (value as RichfieldAdminTargetKey)
    : "library";
}

export function getRichfieldAdminTarget(key: RichfieldAdminTargetKey) {
  return RICHFIELD_ADMIN_TARGETS.find((target) => target.key === key) ?? RICHFIELD_ADMIN_TARGETS[1];
}

export function getRichfieldCmsWorkspacePath(
  targetKey: RichfieldAdminTargetKey,
  workspaceId = getRichfieldWorkspaceId(),
) {
  const target = getRichfieldAdminTarget(targetKey);
  return `/${encodeURIComponent(workspaceId)}${target.pathSuffix}`;
}

export function buildRichfieldCmsUrl({
  cmsBaseUrl = getRichfieldCmsBaseUrl(),
  targetKey,
  workspaceId = getRichfieldWorkspaceId(),
}: {
  cmsBaseUrl?: string;
  targetKey: RichfieldAdminTargetKey;
  workspaceId?: string;
}) {
  return new URL(getRichfieldCmsWorkspacePath(targetKey, workspaceId), cmsBaseUrl).toString();
}

export function buildRichfieldWorkspaceUrl({
  targetKey,
  webAppUrl = getRichfieldWebAppUrl(),
  workspaceId = getRichfieldWorkspaceId(),
}: {
  targetKey: RichfieldAdminTargetKey;
  webAppUrl?: string;
  workspaceId?: string;
}) {
  return new URL(getRichfieldCmsWorkspacePath(targetKey, workspaceId), webAppUrl).toString();
}

export function buildRichfieldDriveUrl({
  webAppUrl = getRichfieldWebAppUrl(),
  workspaceId = getRichfieldWorkspaceId(),
}: {
  webAppUrl?: string;
  workspaceId?: string;
} = {}) {
  return new URL(
    `/${encodeURIComponent(workspaceId)}/drive`,
    webAppUrl,
  ).toString();
}

export function buildRichfieldCentralizedLoginUrl({
  appBaseUrl = getRichfieldAppBaseUrl(),
  nextUrl = "/admin",
  webAppUrl = getRichfieldWebAppUrl(),
}: {
  appBaseUrl?: string;
  nextUrl?: string;
  webAppUrl?: string;
}) {
  const appOrigin = new URL(appBaseUrl).origin;
  const verifyUrl = new URL("/verify-token", appOrigin);
  verifyUrl.searchParams.set("nextUrl", sanitizeRichfieldNextPath(nextUrl, appOrigin));

  const loginUrl = new URL("/login", webAppUrl);
  loginUrl.searchParams.set("returnUrl", verifyUrl.toString());
  return loginUrl.toString();
}

export function getRichfieldAdminLoginPath(targetKey: RichfieldAdminTargetKey) {
  return `/admin/login?next=${encodeURIComponent(targetKey)}`;
}

export function buildRichfieldAdminLinks(workspaceId = getRichfieldWorkspaceId()) {
  const cmsBaseUrl = getRichfieldCmsBaseUrl();

  return RICHFIELD_ADMIN_TARGETS.map((target) => ({
    ...target,
    cmsHref: buildRichfieldCmsUrl({
      cmsBaseUrl,
      targetKey: target.key,
      workspaceId,
    }),
    loginHref: getRichfieldAdminLoginPath(target.key),
  }));
}
