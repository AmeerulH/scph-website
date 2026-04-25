import crypto from "node:crypto";

/** HttpOnly cookie name for unlocked journalist workshop session (Phase 3+). */
export const JOURNALIST_WORKSHOP_SESSION_COOKIE = "scph_jw_session";

export type JournalistWorkshopSessionPayload = {
  /** Schema version for forward compatibility */
  v: 1;
  slug: string;
  driveFolderId: string;
  /** Unix seconds */
  exp: number;
};

function hmacHex(secret: string, data: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

/** Signed opaque session value (base64url JSON + hex HMAC). */
export function signJournalistWorkshopSession(
  payload: JournalistWorkshopSessionPayload,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = hmacHex(`${secret}:jw-session`, body);
  return `${body}.${sig}`;
}

export function verifyJournalistWorkshopSession(
  token: string,
  secret: string,
): JournalistWorkshopSessionPayload | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const body = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = hmacHex(`${secret}:jw-session`, body);
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) {
      return null;
    }
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  if (o.v !== 1) return null;
  if (typeof o.slug !== "string" || typeof o.driveFolderId !== "string") return null;
  if (typeof o.exp !== "number") return null;
  if (o.exp < Math.floor(Date.now() / 1000)) return null;
  return {
    v: 1,
    slug: o.slug,
    driveFolderId: o.driveFolderId,
    exp: o.exp,
  };
}

/** Constant-time comparison of two access codes (via HMAC digests). */
export function journalistWorkshopCodesMatch(
  stored: string,
  entered: string,
  secret: string,
): boolean {
  const key = `${secret}:jw-access-code`;
  const ha = crypto.createHmac("sha256", key).update(stored).digest();
  const hb = crypto.createHmac("sha256", key).update(entered).digest();
  return crypto.timingSafeEqual(ha, hb);
}
