import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" || process.env.GTP_PROGRAMME_REVIEW_MODE !== "1") return new NextResponse(null, {status: 404});
  let body: unknown;
  try {body = await request.json();} catch {return NextResponse.json({ok: false, error: "Invalid request."}, {status: 400});}
  const email = typeof body === "object" && body && "email" in body && typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  return email === "eligible@example.invalid"
    ? NextResponse.json({ok: true, formUrl: null})
    : NextResponse.json({ok: false, error: "This local fixture accepts eligible@example.invalid. Correct the email to preview the eligibility result."}, {status: 403});
}
