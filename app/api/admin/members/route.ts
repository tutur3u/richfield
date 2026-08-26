import { getRichfieldAdminSession } from "@/lib/richfield-admin-api";
import {
  getRichfieldAdminMembers,
  inviteRichfieldAdminMembers,
  removeRichfieldAdminMember,
  updateRichfieldAdminInvitationRoles,
  updateRichfieldAdminMemberRole,
  RichfieldAdminMembersError,
} from "@/lib/richfield-admin-members";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

function readErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed";
}

function readErrorStatus(error: unknown) {
  return error instanceof RichfieldAdminMembersError ? error.status : 500;
}

export async function GET() {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json(await getRichfieldAdminMembers(session.accessToken));
  } catch (error) {
    return NextResponse.json(
      { error: readErrorMessage(error) },
      { status: readErrorStatus(error) },
    );
  }
}

const inviteSchema = z.object({
  emails: z.array(z.email()).min(1).max(50),
  roleId: z.string().trim().min(1).nullable().optional(),
});
const removeSchema = z
  .object({ email: z.email().optional(), id: z.string().trim().min(1).optional() })
  .refine((value) => Boolean(value.email || value.id));
const roleSchema = z.object({
  enabled: z.boolean(),
  roleId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
});
const invitationRoleSchema = z.object({
  email: z.email(),
  roleIds: z.array(z.string().trim().min(1)).max(50),
});

export async function POST(request: Request) {
  const session = await getRichfieldAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = inviteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter at least one valid email." }, { status: 400 });
  }

  try {
    const emails = [...new Set(parsed.data.emails.map((email) => email.toLowerCase()))];
    return NextResponse.json(
      await inviteRichfieldAdminMembers(
        session.accessToken,
        emails,
        parsed.data.roleId ? [parsed.data.roleId] : [],
      ),
    );
  } catch (error) {
    return NextResponse.json(
      { error: readErrorMessage(error) },
      { status: readErrorStatus(error) },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getRichfieldAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = removeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a member to remove." }, { status: 400 });
  }
  if (
    parsed.data.id === session.user.id ||
    (parsed.data.email &&
      session.user.email &&
      parsed.data.email.toLowerCase() === session.user.email.toLowerCase())
  ) {
    return NextResponse.json(
      { error: "You cannot remove your own access." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(
      await removeRichfieldAdminMember(session.accessToken, parsed.data),
    );
  } catch (error) {
    return NextResponse.json(
      { error: readErrorMessage(error) },
      { status: readErrorStatus(error) },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getRichfieldAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await request.json().catch(() => null);
  const invitationParsed = invitationRoleSchema.safeParse(payload);
  if (invitationParsed.success) {
    try {
      return NextResponse.json(
        await updateRichfieldAdminInvitationRoles(
          session.accessToken,
          invitationParsed.data,
        ),
      );
    } catch (error) {
      return NextResponse.json(
        { error: readErrorMessage(error) },
        { status: readErrorStatus(error) },
      );
    }
  }

  const parsed = roleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a valid access level." }, { status: 400 });
  }
  if (parsed.data.userId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot change your own access levels." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(
      await updateRichfieldAdminMemberRole(session.accessToken, parsed.data),
    );
  } catch (error) {
    return NextResponse.json(
      { error: readErrorMessage(error) },
      { status: readErrorStatus(error) },
    );
  }
}
