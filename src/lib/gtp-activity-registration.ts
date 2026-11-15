export type ActivityRegistrationState = {
  status: "open" | "comingSoon" | "closed";
  label: string;
};

export function safeRegistrationUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export function resolveActivityRegistration(
  page: {registrationStatus: ActivityRegistrationState["status"]; registrationUrl?: string; registrationLabel?: string},
  environment: {formUrl?: string; participantSheetId?: string; clientEmail?: string; privateKey?: string},
): ActivityRegistrationState & {formUrl: string | null} {
  const formUrl = safeRegistrationUrl(page.registrationUrl?.trim() || environment.formUrl);
  const configured = Boolean(formUrl && environment.participantSheetId?.trim() && environment.clientEmail?.trim() && environment.privateKey?.trim());
  const status = page.registrationStatus === "closed" ? "closed"
    : page.registrationStatus === "open" && configured ? "open" : "comingSoon";
  return {
    status,
    label: status === "open" ? page.registrationLabel?.trim() || "Register here"
      : status === "closed" ? "Registration closed" : "Registration opening soon",
    formUrl: status === "open" ? formUrl : null,
  };
}

export function normalizeParticipantEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** Only explicitly configured attendee-email columns confer eligibility. */
export function participantEmailsFromRows(
  headers: unknown[], rows: unknown[][], approvedHeaders: string[] = ["EMAIL"],
): Set<string> {
  const approved = approvedHeaders.map((header) => header.trim().toUpperCase()).filter(Boolean);
  const indices = approved.map((header) => headers.findIndex((value) => String(value).trim().toUpperCase() === header));
  if (!indices.length || indices.some((index) => index < 0)) {
    throw new Error("An approved attendee-email column is missing.");
  }
  return new Set(rows.flatMap((row) => indices.map((index) => row[index]))
    .filter((value): value is string => typeof value === "string")
    .map(normalizeParticipantEmail)
    .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)));
}
