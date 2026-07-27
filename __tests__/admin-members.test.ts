import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { normalizeRichfieldAdminMembersPayload } from "@/lib/richfield-admin-members";

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
});
