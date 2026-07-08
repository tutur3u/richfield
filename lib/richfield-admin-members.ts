import { getRichfieldApiBaseUrl, getRichfieldWorkspaceId } from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";

type RawMember = Record<string, unknown>;

export type RichfieldAdminMember = {
  email: string | null;
  id: string;
  initials: string;
  name: string;
  role: string;
  status: string;
};

export type RichfieldAdminMembersContext = {
  boundProjectName: string | null;
  canManageMembers: boolean;
  canManageRoles: boolean;
  currentUserEmail: string | null;
  workspaceId: string;
};

export type RichfieldAdminMembersPayload = {
  context: RichfieldAdminMembersContext | null;
  members: RichfieldAdminMember[];
};

export class RichfieldAdminMembersError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RichfieldAdminMembersError";
    this.status = status;
  }
}

function readRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readBoolean(record: Record<string, unknown>, key: string) {
  return record[key] === true;
}

function readRoles(record: Record<string, unknown>) {
  const roles = record.roles;
  if (!Array.isArray(roles) || roles.length === 0) return null;

  const roleNames = roles
    .map((role) => readString(readRecord(role), "name"))
    .filter((role): role is string => Boolean(role))
    .join(", ");

  return roleNames || null;
}

function initialsFor(name: string, email: string | null) {
  const source = name || email || "Editor";
  return (
    source
      .split(/[\s._@-]+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "E"
  );
}

export function normalizeRichfieldAdminMembersPayload({
  context,
  members,
}: {
  context: unknown;
  members: unknown;
}): RichfieldAdminMembersPayload {
  const rawContext = readRecord(context);
  const normalizedContext: RichfieldAdminMembersContext | null = rawContext.workspaceId
    ? {
        boundProjectName: readString(rawContext, "boundProjectName"),
        canManageMembers: readBoolean(rawContext, "canManageMembers"),
        canManageRoles: readBoolean(rawContext, "canManageRoles"),
        currentUserEmail: readString(rawContext, "currentUserEmail"),
        workspaceId: readString(rawContext, "workspaceId") ?? "",
      }
    : null;

  const normalizedMembers = Array.isArray(members)
    ? members.map((member, index) => normalizeMember(readRecord(member), index))
    : [];

  return {
    context: normalizedContext,
    members: normalizedMembers,
  };
}

function normalizeMember(member: RawMember, index: number): RichfieldAdminMember {
  const email = readString(member, "email");
  const name =
    readString(member, "workspace_profile_display_name") ??
    readString(member, "display_name") ??
    readString(member, "handle") ??
    email ??
    "Site editor";
  const pending = member.pending === true;
  const memberType =
    readString(member, "workspace_member_type") ??
    readString(member, "type") ??
    "Member";

  return {
    email,
    id: readString(member, "id") ?? email ?? `member-${index}`,
    initials: initialsFor(name, email),
    name,
    role: readRoles(member) ?? memberType,
    status: pending ? "Invited" : "Active",
  };
}

async function readJson(response: Response) {
  return response.json().catch(() => null);
}

export async function getRichfieldAdminMembers(
  accessToken: string,
): Promise<RichfieldAdminMembersPayload> {
  const apiBaseUrl = getRichfieldApiBaseUrl().replace(/\/+$/, "");
  const workspaceId = getRichfieldWorkspaceId();
  const baseEndpoint = `${apiBaseUrl}/workspaces/${encodeURIComponent(
    workspaceId,
  )}/external-projects/members`;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const [contextResponse, membersResponse] = await Promise.all([
    fetchWithRichfieldTimeout(baseEndpoint, { cache: "no-store", headers }),
    fetchWithRichfieldTimeout(`${baseEndpoint}/enhanced?status=joined`, {
      cache: "no-store",
      headers,
    }),
  ]);

  if (!contextResponse.ok || !membersResponse.ok) {
    throw new RichfieldAdminMembersError(
      "Team members are not available right now.",
      contextResponse.ok ? membersResponse.status : contextResponse.status,
    );
  }

  return normalizeRichfieldAdminMembersPayload({
    context: await readJson(contextResponse),
    members: await readJson(membersResponse),
  });
}
