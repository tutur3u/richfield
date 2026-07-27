import { NextResponse } from "next/server";
import {
  ADMIN_LOCALE_COOKIE,
  toAdminLocale,
} from "@/lib/admin/locales";

function safeReturnPath(request: Request, value: FormDataEntryValue | null) {
  const fallback = "/admin";
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, request.url);
    return url.origin === new URL(request.url).origin
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const locale = toAdminLocale(String(formData.get("locale") ?? ""));
  const response = NextResponse.redirect(
    new URL(safeReturnPath(request, formData.get("next")), request.url),
    303,
  );

  response.cookies.set(ADMIN_LOCALE_COOKIE, locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
