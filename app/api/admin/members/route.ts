import { getRichfieldAdminSession } from "@/lib/richfield-admin-api";
import {
  getRichfieldAdminMembers,
  RichfieldAdminMembersError,
} from "@/lib/richfield-admin-members";
import { NextResponse } from "next/server";

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
