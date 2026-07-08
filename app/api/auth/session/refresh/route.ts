import {
  refreshRichfieldSessionFromCookies,
  setRichfieldSessionCookie,
} from "@/lib/richfield-session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await refreshRichfieldSessionFromCookies();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({
    expiresAt: session.expiresAt,
    refreshEarlySeconds: session.refreshEarlySeconds,
    userId: session.user.id,
    valid: true,
  });

  setRichfieldSessionCookie(response, session);
  return response;
}
