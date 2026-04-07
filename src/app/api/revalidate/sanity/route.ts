import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export const runtime = "nodejs";

const GTP_PROGRAMME_DOC_ID = "gtp2026Programme";

/** Document `_type` values that power the Next.js app → paths to revalidate on webhook. */
const SANITY_TYPE_TO_PATHS: Record<string, readonly string[]> = {
  gtp2026Programme: [
    "/events/gtp-2026/programmes",
    "/events/gtp-2026/about",
  ],
  gtp2026HighlightSpeaker: ["/", "/events/gtp-2026/about"],
  gtp2026AboutPage: ["/events/gtp-2026/about"],
  gtp2026CommitteeMember: ["/events/gtp-2026/organising-committee"],
  gtp2026FaqItem: ["/events/gtp-2026/faq"],
  gtp2026GetInvolvedPage: ["/events/gtp-2026/get-involved"],
  gtp2026SubmissionsPage: ["/events/gtp-2026/submissions"],
  gtp2026MediaPage: ["/events/gtp-2026/media"],
  gtp2026BizForumPage: ["/events/gtp-2026/biz-forum"],
  scphHomePage: ["/"],
  scphAboutPage: ["/about-us"],
  scphMeetTheTeamPage: ["/about-us"],
  teamMember: ["/about-us"],
  scphResearchPage: ["/research"],
  scphMediaPage: ["/media"],
  scphNetworkPage: ["/network"],
  scphEventsPage: ["/events"],
  scphProgrammesPage: ["/programmes"],
  scphProjectsPage: ["/projects"],
};

function normalizeSanityDocumentId(id: string): string {
  return id.replace(/^drafts\./, "").replace(/^versions\.[^.]+\./, "");
}

function readTypeFromObject(obj: unknown): string | null {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  const t = (obj as Record<string, unknown>)._type;
  return typeof t === "string" ? t : null;
}

function readIdFromObject(obj: unknown): string | null {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return null;
  const id = (obj as Record<string, unknown>)._id;
  return typeof id === "string" ? id : null;
}

function extractDocumentType(body: unknown): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const o = body as Record<string, unknown>;
  return (
    readTypeFromObject(o) ??
    readTypeFromObject(o.result) ??
    readTypeFromObject(o.document)
  );
}

function extractDocumentId(body: unknown): string | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const o = body as Record<string, unknown>;
  return (
    readIdFromObject(o) ??
    readIdFromObject(o.result) ??
    readIdFromObject(o.document)
  );
}

function pathsForSanityWebhook(req: NextRequest, body: unknown): string[] {
  const headerId = req.headers.get("sanity-document-id");
  if (
    headerId &&
    normalizeSanityDocumentId(headerId) === GTP_PROGRAMME_DOC_ID
  ) {
    return [...SANITY_TYPE_TO_PATHS.gtp2026Programme];
  }

  const docId = extractDocumentId(body);
  if (
    docId &&
    normalizeSanityDocumentId(docId) === GTP_PROGRAMME_DOC_ID
  ) {
    return [...SANITY_TYPE_TO_PATHS.gtp2026Programme];
  }

  const docType = extractDocumentType(body);
  if (!docType) return [];

  const fromType = SANITY_TYPE_TO_PATHS[docType];
  return fromType ? [...fromType] : [];
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret?.trim()) {
    return NextResponse.json(
      { message: "Missing SANITY_REVALIDATE_SECRET" },
      { status: 503 },
    );
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

  const paths = pathsForSanityWebhook(req, body);
  if (paths.length === 0) {
    return NextResponse.json({ message: "Ignored" }, { status: 200 });
  }

  const unique = [...new Set(paths)];
  for (const p of unique) {
    revalidatePath(p);
  }

  return NextResponse.json({
    revalidated: true,
    paths: unique,
  });
}
