import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const runtime = "nodejs";

const GTP_PROGRAMME_DOC_ID = "gtp2026Programme";

function normalizeSanityDocumentId(id: string): string {
  return id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");
}

function isGtpProgrammeWebhook(req: NextRequest, body: unknown): boolean {
  const headerId = req.headers.get("sanity-document-id");
  if (headerId && normalizeSanityDocumentId(headerId) === GTP_PROGRAMME_DOC_ID) {
    return true;
  }
  if (body && typeof body === "object" && !Array.isArray(body)) {
    const o = body as Record<string, unknown>;
    if (o._type === "gtp2026Programme") return true;
    const rawId = o._id;
    if (typeof rawId === "string" && normalizeSanityDocumentId(rawId) === GTP_PROGRAMME_DOC_ID) {
      return true;
    }
  }
  return false;
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret?.trim()) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 503 });
  }

  const { isValidSignature, body } = await parseBody(req, secret.trim());

  if (isValidSignature !== true) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const expectedDataset = process.env.SANITY_DATASET ?? "production";
  const hookDataset = req.headers.get("sanity-dataset");
  if (hookDataset && hookDataset !== expectedDataset) {
    return NextResponse.json(
      { message: "Ignored (dataset does not match app SANITY_DATASET)" },
      { status: 200 },
    );
  }

  if (!isGtpProgrammeWebhook(req, body)) {
    return NextResponse.json({ message: "Ignored" }, { status: 200 });
  }

  revalidatePath("/events/gtp-2026/programmes");
  revalidatePath("/events/gtp-2026/about");

  return NextResponse.json({ revalidated: true, paths: ["/events/gtp-2026/programmes", "/events/gtp-2026/about"] });
}
