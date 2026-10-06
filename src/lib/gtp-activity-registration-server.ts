import "server-only";
import { getGtpProgrammeActivityPage } from "@/sanity/gtp-stage2";
import type { GtpProgrammeActivityPage } from "@/data/gtp-programme-activity-defaults";
import { resolveActivityRegistration } from "./gtp-activity-registration";

export async function getActivityRegistration(page?: GtpProgrammeActivityPage) {
  return resolveActivityRegistration(page ?? await getGtpProgrammeActivityPage("action-workshops"), {
    formUrl: process.env.GTP_ACTION_WORKSHOP_FORM_URL,
    participantSheetId: process.env.GTP_PARTICIPANT_SHEET_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  });
}
