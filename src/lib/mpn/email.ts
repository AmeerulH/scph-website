import "server-only";

import { Resend } from "resend";
import { getSiteUrlString } from "@/lib/site-url";

type SendResult = { sent: true } | { sent: false; reason: string };

type WorkshopSummary = {
  number: number;
  title: string;
} | null;

export type PendingMemberEmailDetails = {
  fullName: string;
  organisation: string | null;
  country: string | null;
  workshop: WorkshopSummary;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function firstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

function getResendClient(): Resend | null {
  const apiKey = process.env.MPN_RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getMpnFromAddress(): string {
  const configured = process.env.MPN_RESEND_FROM?.trim();
  if (configured) return configured;
  return "SCPH Media Professional Network <onboarding@resend.dev>";
}

function getMpnAdminRecipients(): string[] {
  const configured = process.env.MPN_ADMIN_EMAIL?.trim();
  if (!configured) return [];
  return configured
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getMpnSupportEmail(): string | null {
  const configured = process.env.MPN_SUPPORT_EMAIL?.trim();
  if (configured) return configured;
  return getMpnAdminRecipients()[0] ?? null;
}

async function sendMpnEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<SendResult> {
  const resend = getResendClient();
  if (!resend) {
    return { sent: false, reason: "MPN_RESEND_API_KEY is not configured." };
  }

  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  if (recipients.length === 0) {
    return { sent: false, reason: "No email recipients configured." };
  }

  const { error } = await resend.emails.send({
    from: getMpnFromAddress(),
    to: recipients,
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    console.error("MPN email send failed:", error);
    return { sent: false, reason: error.message };
  }

  return { sent: true };
}

function formatWorkshopLine(workshop: WorkshopSummary): string {
  if (!workshop) return "Workshop not specified";
  return `Workshop ${workshop.number} — ${workshop.title}`;
}

export async function sendPendingMemberAlert(
  details: PendingMemberEmailDetails
): Promise<SendResult> {
  const adminRecipients = getMpnAdminRecipients();
  if (adminRecipients.length === 0) {
    return { sent: false, reason: "MPN_ADMIN_EMAIL is not configured." };
  }

  const siteUrl = getSiteUrlString();
  const organisation = details.organisation?.trim() || "Not provided";
  const country = details.country?.trim() || "Not provided";
  const adminUrl = `${siteUrl}/community/mpn/admin/members`;

  return sendMpnEmail({
    to: adminRecipients,
    subject: `New pending MPN member: ${details.fullName}`,
    html: `
      <h2>New MPN application</h2>
      <p><strong>${escapeHtml(details.fullName)}</strong> from ${escapeHtml(organisation)} (${escapeHtml(country)}) has registered and is awaiting approval.</p>
      <p>${escapeHtml(formatWorkshopLine(details.workshop))}</p>
      <p><a href="${adminUrl}">Review in admin dashboard</a></p>
    `,
  });
}

export async function sendMemberWelcomeEmail(input: {
  to: string;
  fullName: string;
}): Promise<SendResult> {
  const siteUrl = getSiteUrlString();
  const loginUrl = `${siteUrl}/community/mpn/login`;

  return sendMpnEmail({
    to: input.to,
    subject: "Welcome to the Media Professional Network",
    html: `
      <h2>Welcome to the Media Professional Network</h2>
      <p>Hi ${escapeHtml(firstName(input.fullName))},</p>
      <p>Your application has been approved. You now have full access to the MPN portal.</p>
      <p><a href="${loginUrl}">Access the portal</a></p>
      <hr>
      <p>The MPN is your private space to access SCPH research, connect with fellow journalists, and publish your work.</p>
    `,
  });
}

export async function sendMemberRejectionEmail(input: {
  to: string;
  fullName: string;
  reason?: string | null;
}): Promise<SendResult> {
  const supportEmail = getMpnSupportEmail();
  const reasonBlock = input.reason?.trim()
    ? `<p>Reason: ${escapeHtml(input.reason.trim())}</p>`
    : "";
  const supportBlock = supportEmail
    ? `<p>If you believe this is an error, please contact us at <a href="mailto:${escapeHtml(supportEmail)}">${escapeHtml(supportEmail)}</a>.</p>`
    : `<p>If you believe this is an error, please contact the Sunway Centre for Planetary Health team.</p>`;

  return sendMpnEmail({
    to: input.to,
    subject: "Your MPN application",
    html: `
      <h2>Your MPN application</h2>
      <p>Hi ${escapeHtml(firstName(input.fullName))},</p>
      <p>Thank you for applying to the Media Professional Network. Unfortunately, we are unable to approve your application at this time.</p>
      ${reasonBlock}
      ${supportBlock}
    `,
  });
}

export async function notifyAdminsOfPendingMember(userId: string): Promise<SendResult> {
  const { createAdminClient } = await import("@/lib/mpn/supabase/admin");
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("full_name, organisation, country, workshops(number, title)")
    .eq("id", userId)
    .eq("role", "pending")
    .maybeSingle();

  if (error || !data) {
    console.error("Unable to load pending member for admin alert:", error);
    return { sent: false, reason: "Pending member profile not found." };
  }

  const workshopRaw = data.workshops;
  const workshop = Array.isArray(workshopRaw)
    ? (workshopRaw[0] as WorkshopSummary)
    : (workshopRaw as WorkshopSummary);

  return sendPendingMemberAlert({
    fullName: data.full_name,
    organisation: data.organisation,
    country: data.country,
    workshop: workshop ?? null,
  });
}
