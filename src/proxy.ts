import { NextResponse } from "next/server";
import { canReviewGtpLibrary } from "@/lib/gtp-library-review-access";

/** Reject before App Router streams its loading boundary, preserving a real HTTP 404. */
export function proxy() {
  if (!canReviewGtpLibrary()) {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dev/gtp-library-review/:path*"] };
