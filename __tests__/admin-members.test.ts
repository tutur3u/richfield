import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  inviteRichfieldAdminMembers,
  normalizeRichfieldAdminMembersPayload,
  updateRichfieldAdminInvitationRoles,
  updateRichfieldAdminMemberRole,
} from "@/lib/richfield-admin-members";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

const membersSource = readFileSync(
  join(process.cwd(), "lib/richfield-admin-members.ts"),
  "utf8",
);

describe("the roster includes people who were invited", () => {
  test("pending members are labelled Invited rather than dropped", () => {
    const { members } = normalizeRichfieldAdminMembersPayload({
      context: { workspaceId: "ws" },
      members: [
        { display_name: "Mai", email: "mai@richfield.test", id: "1" },
        { email: "new.hire@richfield.test", id: "2", pending: true },
      ],
    });

    expect(members.map((member) => member.status)).toEqual([
      "Active",
      "Invited",
    ]);
  });

  test("an invited member with no profile still shows their email", () => {
    // Someone who has not accepted yet has no display name or handle, so
    // falling back to a generic label would make every pending row identical.
    const { members } = normalizeRichfieldAdminMembersPayload({
      context: { workspaceId: "ws" },
      members: [{ email: "new.hire@richfield.test", id: "2", pending: true }],
    });

    expect(members[0]?.name).toBe("new.hire@richfield.test");
    expect(members[0]?.email).toBe("new.hire@richfield.test");
  });

  test("the fetch asks for every status, not just joined", () => {
    // The parsing above has always handled `pending`, but the request filtered
    // pending rows out before they could reach it, so invitations were
    // invisible however well they were rendered.
    expect(membersSource).toContain("status=all");
    expect(membersSource).not.toContain("status=joined");
  });

  test("marks the signed-in person so the UI cannot revoke itself", () => {
    const { members } = normalizeRichfieldAdminMembersPayload({
      context: { currentUserEmail: "mai@richfield.test", workspaceId: "ws" },
      members: [{ email: "MAI@richfield.test", id: "1" }],
    });

    expect(members[0]?.isCurrentUser).toBe(true);
  });

  test("keeps access-level ids so existing roles can be changed in Richfield", () => {
    const payload = normalizeRichfieldAdminMembersPayload({
      context: { canManageRoles: true, workspaceId: "ws" },
      members: [
        {
          email: "mai@richfield.test",
          id: "member-1",
          roles: [{ id: "role-editor", name: "Website editor" }],
        },
      ],
      roles: [
        { id: "role-editor", name: "Website editor" },
        { id: "role-publisher", name: "Publisher" },
      ],
    });

    expect(payload.members[0]?.roles).toEqual([
      { id: "role-editor", name: "Website editor" },
    ]);
    expect(payload.roles).toHaveLength(2);
  });

  test("adds an access level through the external-project member contract", async () => {
    vi.stubEnv("TUTURUUU_API_BASE_URL", "https://api.example.test/v1");
    vi.stubEnv("TUTURUUU_RICHFIELD_WORKSPACE_ID", "workspace-1");
    const fetchMock = vi.fn(async () => Response.json({ message: "success" }));
    vi.stubGlobal("fetch", fetchMock);

    await updateRichfieldAdminMemberRole("token", {
      enabled: true,
      roleId: "publisher",
      userId: "member-1",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/workspaces/workspace-1/external-projects/members/roles/publisher/members",
      expect.objectContaining({
        body: JSON.stringify({ memberIds: ["member-1"] }),
        method: "POST",
      }),
    );
  });

  test("assigns an access level while inviting members", async () => {
    vi.stubEnv("TUTURUUU_API_BASE_URL", "https://api.example.test/v1");
    vi.stubEnv("TUTURUUU_RICHFIELD_WORKSPACE_ID", "workspace-1");
    const fetchMock = vi.fn(async () => Response.json({ message: "success" }));
    vi.stubGlobal("fetch", fetchMock);

    await inviteRichfieldAdminMembers(
      "token",
      ["new.hire@richfield.test"],
      ["publisher"],
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/workspaces/workspace-1/external-projects/members/invite",
      expect.objectContaining({
        body: JSON.stringify({
          emails: ["new.hire@richfield.test"],
          roleIds: ["publisher"],
        }),
        method: "POST",
      }),
    );
  });

  test("updates access levels on an outstanding invitation", async () => {
    vi.stubEnv("TUTURUUU_API_BASE_URL", "https://api.example.test/v1");
    vi.stubEnv("TUTURUUU_RICHFIELD_WORKSPACE_ID", "workspace-1");
    const fetchMock = vi.fn(async () => Response.json({ message: "success" }));
    vi.stubGlobal("fetch", fetchMock);

    await updateRichfieldAdminInvitationRoles("token", {
      email: "new.hire@richfield.test",
      roleIds: ["publisher"],
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/v1/workspaces/workspace-1/external-projects/members/invite",
      expect.objectContaining({
        body: JSON.stringify({
          email: "new.hire@richfield.test",
          roleIds: ["publisher"],
        }),
        method: "PATCH",
      }),
    );
  });
});
