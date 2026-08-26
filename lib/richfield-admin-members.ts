import { getRichfieldApiBaseUrl, getRichfieldWorkspaceId } from "./richfield-config";
import { fetchWithRichfieldTimeout } from "./richfield-fetch";

type RawMember = Record<string, unknown>;

export type RichfieldAdminMember = {
  email: string | null;
  id: string;
  initials: string;
  isCurrentUser: boolean;
  name: string;
  role: string;
  roles: RichfieldAdminRole[];
  status: string;
};

export type RichfieldAdminRole = {
  id: string;
  name: string;
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
  roles: RichfieldAdminRole[];
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
  if (!Array.isArray(roles) || roles.length === 0) return [];

  return roles.flatMap((role) => {
    const record = readRecord(role);
    const id = readString(record, "id");
    const name = readString(record, "name");
    return id && name ? [{ id, name }] : [];
  });
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
  roles = [],
}: {
  context: unknown;
  members: unknown;
  roles?: unknown;
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
    members: normalizedMembers.map((member) => ({
      ...member,
      isCurrentUser:
        Boolean(normalizedContext?.currentUserEmail) &&
        member.email?.toLowerCase() === normalizedContext?.currentUserEmail?.toLowerCase(),
    })),
    roles: Array.isArray(roles)
      ? roles.flatMap((role) => {
          const record = readRecord(role);
          const id = readString(record, "id");
          const name = readString(record, "name");
          return id && name ? [{ id, name }] : [];
        })
      : [],
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
  const roles = readRoles(member);

  return {
    email,
    id: readString(member, "id") ?? email ?? `member-${index}`,
    initials: initialsFor(name, email),
    isCurrentUser: false,
    name,
    role: roles.map((role) => role.name).join(", ") || memberType,
    roles,
    status: pending ? "Invited" : "Active",
  };
}

function membersEndpoint(path = "") {
  const apiBaseUrl = getRichfieldApiBaseUrl().replace(/\/+$/, "");
  const workspaceId = getRichfieldWorkspaceId();
  return `${apiBaseUrl}/workspaces/${encodeURIComponent(workspaceId)}/external-projects/members${path}`;
}

export async function inviteRichfieldAdminMembers(
  accessToken: string,
  emails: string[],
) {
  return mutateMembers(accessToken, membersEndpoint("/invite"), "POST", { emails });
}

export async function removeRichfieldAdminMember(
  accessToken: string,
  identity: { email?: string; id?: string },
) {
  const params = new URLSearchParams();
  if (identity.email) params.set("email", identity.email);
  if (identity.id) params.set("id", identity.id);
  return mutateMembers(
    accessToken,
    `${membersEndpoint("/access")}?${params}`,
    "DELETE",
  );
}

export async function updateRichfieldAdminMemberRole(
  accessToken: string,
  input: { enabled: boolean; roleId: string; userId: string },
) {
  const roleMembersEndpoint = `${membersEndpoint(
    `/roles/${encodeURIComponent(input.roleId)}/members`,
  )}`;

  return mutateMembers(
    accessToken,
    input.enabled
      ? roleMembersEndpoint
      : `${roleMembersEndpoint}/${encodeURIComponent(input.userId)}`,
    input.enabled ? "POST" : "DELETE",
    input.enabled ? { memberIds: [input.userId] } : undefined,
  );
}

async function mutateMembers(
  accessToken: string,
  endpoint: string,
  method: "DELETE" | "POST",
  body?: unknown,
) {
  const response = await fetchWithRichfieldTimeout(endpoint, {
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    method,
  });
  const payload = await readJson(response);

  if (!response.ok) {
    const record = readRecord(payload);
    throw new RichfieldAdminMembersError(
      readString(record, "error") ??
        readString(record, "message") ??
        "Team member request failed.",
      response.status,
    );
  }

  return payload;
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
  const [contextResponse, membersResponse, rolesResponse] = await Promise.all([
    fetchWithRichfieldTimeout(baseEndpoint, { cache: "no-store", headers }),
    // status=all, not joined: pending invitations are members-in-waiting and the
    // roster is the only place anyone would notice an invite that was never
    // accepted. normalizeMember already labels them "Invited".
    fetchWithRichfieldTimeout(`${baseEndpoint}/enhanced?status=all`, {
      cache: "no-store",
      headers,
    }),
    fetchWithRichfieldTimeout(`${baseEndpoint}/roles`, {
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
    roles: rolesResponse.ok ? await readJson(rolesResponse) : [],
  });
}
