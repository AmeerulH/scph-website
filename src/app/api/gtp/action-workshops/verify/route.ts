import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { normalizeGooglePrivateKey } from "@/lib/google-drive-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PARTICIPANT_SHEET_ID = process.env.GTP_PARTICIPANT_SHEET_ID?.trim();
const PARTICIPANT_SHEET_TAB = process.env.GTP_PARTICIPANT_SHEET_TAB?.trim() || "Sheet1";
const FORM_URL = process.env.GTP_ACTION_WORKSHOP_FORM_URL?.trim();
const EMAIL_HEADER = "EMAIL";
const CACHE_TTL_MS = 5 * 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_ATTEMPTS = 10;

let cachedEmails: { expiresAt: number; values: Set<string> } | null = null;
const ATTEMPTS = new Map<string, { count: number; resetAt: number }>();

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function columnLetter(index: number) {
  let result = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

function pruneAttempts(now: number) {
  for (const [ip, attempt] of ATTEMPTS) {
    if (now > attempt.resetAt) ATTEMPTS.delete(ip);
  }
}

function rateLimited(ip: string, now: number) {
  const attempt = ATTEMPTS.get(ip);
  return Boolean(attempt && now <= attempt.resetAt && attempt.count >= RATE_MAX_ATTEMPTS);
}

function recordAttempt(ip: string, now: number) {
  const current = ATTEMPTS.get(ip);
  if (!current || now > current.resetAt) {
    ATTEMPTS.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  current.count += 1;
}

async function getParticipantEmails() {
  if (cachedEmails && cachedEmails.expiresAt > Date.now()) return cachedEmails.values;

  const privateKey = normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  if (!PARTICIPANT_SHEET_ID || !privateKey || !clientEmail) {
    throw new Error("Participant verification is not configured.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  const sheets = google.sheets({ version: "v4", auth });
  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: PARTICIPANT_SHEET_ID,
    range: `'${PARTICIPANT_SHEET_TAB}'!1:1`,
  });
  const headers = headerResponse.data.values?.[0] ?? [];
  const emailColumnIndex = headers.findIndex(
    (header) => String(header).trim().toUpperCase() === EMAIL_HEADER,
  );
  if (emailColumnIndex < 0) {
    throw new Error(`Could not find ${EMAIL_HEADER} column in participant sheet.`);
  }

  const lastHeaderColumn = columnLetter(headers.length - 1);
  const participantResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: PARTICIPANT_SHEET_ID,
    range: `'${PARTICIPANT_SHEET_TAB}'!A2:${lastHeaderColumn}`,
  });
  const values = new Set(
    (participantResponse.data.values ?? [])
      .flatMap((row) => {
        const primaryEmail = row[emailColumnIndex];
        const allCells = row.filter((value) => typeof value === "string");
        return [primaryEmail, ...allCells];
      })
      .map((email) => (typeof email === "string" ? normalizeEmail(email) : ""))
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      .filter(Boolean),
  );

  cachedEmails = { values, expiresAt: Date.now() + CACHE_TTL_MS };
  return values;
}

export async function POST(req: NextRequest) {
  const now = Date.now();
  const ip = clientIp(req);
  pruneAttempts(now);
  if (rateLimited(ip, now)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    typeof (body as { email?: unknown }).email === "string"
      ? normalizeEmail((body as { email: string }).email)
      : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  recordAttempt(ip, now);

  try {
    const participantEmails = await getParticipantEmails();
    if (!participantEmails.has(email)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not verify that email as a GTP 2026 participant. Please use the email used for your conference registration.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json({ ok: true, formUrl: FORM_URL || null });
  } catch (error) {
    console.error("Action workshop participant verification failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not verify your registration right now. Please try again later." },
      { status: 503 },
    );
  }
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}
