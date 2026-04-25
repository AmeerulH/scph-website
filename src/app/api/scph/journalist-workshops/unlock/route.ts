import { type NextRequest, NextResponse } from "next/server";
import {
  JOURNALIST_WORKSHOP_SESSION_COOKIE,
  journalistWorkshopCodesMatch,
  signJournalistWorkshopSession,
} from "@/lib/journalist-workshop-session";
import { getScphJournalistWorkshopsPage } from "@/sanity/scph-journalist-workshops";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_MAX_AGE_SEC = 7 * 24 * 60 * 60;

/** Per-IP failed unlock attempts (in-memory; resets per deploy on serverless). */
const RATE_FAILS = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_FAILS = 40;

function pruneRateLimit(now: number) {
  for (const [ip, v] of RATE_FAILS) {
    if (now > v.resetAt) RATE_FAILS.delete(ip);
  }
}

function clientIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const row = RATE_FAILS.get(ip);
  if (!row || now > row.resetAt) return false;
  return row.count >= RATE_MAX_FAILS;
}

function recordFailedUnlock(ip: string, now: number) {
  let row = RATE_FAILS.get(ip);
  if (!row || now > row.resetAt) {
    row = { count: 0, resetAt: now + RATE_WINDOW_MS };
    RATE_FAILS.set(ip, row);
  }
  row.count += 1;
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const secret = process.env.JOURNALIST_WORKSHOP_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) {
    return NextResponse.json(
      { ok: false, error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const now = Date.now();
  pruneRateLimit(now);
  const ip = clientIp(req);
  if (isRateLimited(ip, now)) {
    return NextResponse.json({ ok: false, error: "Too many attempts" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  const code =
    typeof body === "object" &&
    body !== null &&
    typeof (body as { code?: unknown }).code === "string"
      ? (body as { code: string }).code.trim()
      : "";

  if (!code) {
    recordFailedUnlock(ip, now);
    return unauthorized();
  }

  const page = await getScphJournalistWorkshopsPage().catch(() => null);
  const workshops = page?.workshops ?? [];

  type Match = { slug: string; driveFolderId: string };
  let matched: Match | null = null;

  for (const w of workshops) {
    if (w.enabled === false) continue;
    const stored = w.accessCode?.trim();
    const slug = w.slug?.current?.trim();
    const folder = w.driveFolderId?.trim();
    if (!stored || !slug || !folder) continue;
    if (journalistWorkshopCodesMatch(stored, code, secret)) {
      matched = { slug, driveFolderId: folder };
      break;
    }
  }

  if (!matched) {
    recordFailedUnlock(ip, now);
    return unauthorized();
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const token = signJournalistWorkshopSession(
    { v: 1, slug: matched.slug, driveFolderId: matched.driveFolderId, exp },
    secret,
  );

  const res = NextResponse.json({ ok: true });
  res.cookies.set(JOURNALIST_WORKSHOP_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return res;
}

/** Disallow GET to avoid accidental logging of query tokens. */
export function GET() {
  return new NextResponse(null, { status: 405 });
}
