"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * GTP 2026 enquiry inbox (Get Involved + embedded forms on GTP About & SCPH home).
 * Set `GTP_CONTACT_EMAIL` in `.env.local` (e.g. scph_gtpc2026@sunway.edu.my).
 * Falls back to `CONTACT_EMAIL` if unset.
 */
function getGtpContactRecipient(): string | undefined {
  return (
    process.env.GTP_CONTACT_EMAIL?.trim() ||
    process.env.CONTACT_EMAIL?.trim() ||
    undefined
  );
}

/**
 * Resend "from" address. Must be from a domain you verified in Resend.
 * Default `onboarding@resend.dev` only allows sending TO your Resend account email —
 * use RESEND_FROM + a verified domain to deliver to any inbox (e.g. team@sunway.edu.my).
 */
function getResendFrom(): string {
  const configured = process.env.RESEND_FROM?.trim();
  if (configured) return configured;
  return "GTP 2026 Contact <onboarding@resend.dev>";
}

export type ContactFormState = { error?: string; success?: boolean } | null;

export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { error: "Please fill in all fields." };
  }

  const recipient = getGtpContactRecipient();
  if (!recipient) {
    console.error(
      "GTP_CONTACT_EMAIL or CONTACT_EMAIL is not set in environment variables",
    );
    return { error: "Contact form is not configured. Please try again later." };
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return { error: "Contact form is not configured. Please try again later." };
  }

  try {
    const { error } = await resend.emails.send({
      from: getResendFrom(),
      to: recipient,
      replyTo: email,
      subject: `GTP 2026 Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: "Failed to send message. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Contact form error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
