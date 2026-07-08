import { clearRichfieldSessionCookie } from "@/lib/richfield-session";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/", request.url), 303);

  clearRichfieldSessionCookie(response);
  return response;
}
