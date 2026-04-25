import { NextResponse } from "next/server";
import { JOURNALIST_WORKSHOP_SESSION_COOKIE } from "@/lib/journalist-workshop-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(JOURNALIST_WORKSHOP_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}
