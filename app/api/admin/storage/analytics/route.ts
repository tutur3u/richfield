import { NextResponse } from "next/server";
import { getRichfieldAdminSession } from "@/lib/richfield-admin-api";
import { getRichfieldStorageAnalytics } from "@/lib/richfield-admin-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getRichfieldAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    await getRichfieldStorageAnalytics(session.accessToken),
  );
}
