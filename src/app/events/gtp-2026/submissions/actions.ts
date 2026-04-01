"use server";

import { google } from "googleapis";

// ─── Google Sheets client ─────────────────────────────────────────────────────

function getSheetsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error("Google Sheets credentials are not configured.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: clientEmail, private_key: privateKey },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubmissionFormState = { error?: string; success?: boolean } | null;

// ─── Abstract Submission ──────────────────────────────────────────────────────

export async function sendAbstractSubmission(
  _prevState: SubmissionFormState,
  formData: FormData
): Promise<SubmissionFormState> {
  const fields = {
    email: formData.get("email") as string,
    fullName: formData.get("fullName") as string,
    institution: formData.get("institution") as string,
    designation: formData.get("designation") as string,
    country: formData.get("country") as string,
    earlyCareer: formData.get("earlyCareer") as string,
    primaryTheme: formData.get("primaryTheme") as string,
    presentationPreference: formData.get("presentationPreference") as string,
    abstractTitle: formData.get("abstractTitle") as string,
    abstract: formData.get("abstract") as string,
    authorList: formData.get("authorList") as string,
  };

  const requiredFields = [
    "email", "fullName", "institution", "designation", "country",
    "earlyCareer", "primaryTheme", "presentationPreference",
    "abstractTitle", "abstract", "authorList",
  ] as const;

  for (const key of requiredFields) {
    if (!fields[key]?.trim()) {
      return { error: "Please fill in all required fields." };
    }
  }

  if (!SHEET_ID) {
    console.error("GOOGLE_SHEET_ID is not set");
    return { error: "Submission service is not configured. Please try again later." };
  }

  try {
    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Abstract Submissions!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString("en-GB", { timeZone: "Asia/Kuala_Lumpur" }),
          fields.email,
          fields.fullName,
          fields.institution,
          fields.designation,
          fields.country,
          fields.earlyCareer,
          fields.primaryTheme,
          fields.presentationPreference,
          fields.abstractTitle,
          fields.abstract,
          fields.authorList,
        ]],
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Abstract submission error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

// ─── Action Workshop Submission ───────────────────────────────────────────────

export async function sendWorkshopSubmission(
  _prevState: SubmissionFormState,
  formData: FormData
): Promise<SubmissionFormState> {
  const fields = {
    email: formData.get("email") as string,
    fullName: formData.get("fullName") as string,
    institution: formData.get("institution") as string,
    designation: formData.get("designation") as string,
    country: formData.get("country") as string,
    sessionTitle: formData.get("sessionTitle") as string,
    primaryPillar: formData.get("primaryPillar") as string,
    primaryTheme: formData.get("primaryTheme") as string,
    secondaryThemes: formData.getAll("secondaryThemes") as string[],
    sessionObjectives: formData.get("sessionObjectives") as string,
    expectedOutcomes: formData.get("expectedOutcomes") as string,
    sessionDetails: formData.get("sessionDetails") as string,
    speakerList: formData.get("speakerList") as string,
    resourceRequirements: formData.get("resourceRequirements") as string,
    financialResources: formData.get("financialResources") as string,
    diversityStatement: formData.get("diversityStatement") as string,
    conflictOfInterest: formData.get("conflictOfInterest") as string,
    conflictDetails: formData.get("conflictDetails") as string,
  };

  const requiredFields = [
    "email", "fullName", "institution", "designation", "country",
    "sessionTitle", "primaryPillar", "primaryTheme",
    "sessionObjectives", "expectedOutcomes", "sessionDetails", "speakerList",
    "resourceRequirements", "financialResources",
    "diversityStatement", "conflictOfInterest",
  ] as const;

  for (const key of requiredFields) {
    if (!fields[key]?.trim()) {
      return { error: "Please fill in all required fields." };
    }
  }

  if (fields.conflictOfInterest === "No, I have conflicts" && !fields.conflictDetails?.trim()) {
    return { error: "Please specify your conflicts of interest." };
  }

  if (!SHEET_ID) {
    console.error("GOOGLE_SHEET_ID is not set");
    return { error: "Submission service is not configured. Please try again later." };
  }

  try {
    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Workshop Submissions!A:S",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString("en-GB", { timeZone: "Asia/Kuala_Lumpur" }),
          fields.email,
          fields.fullName,
          fields.institution,
          fields.designation,
          fields.country,
          fields.sessionTitle,
          fields.primaryPillar,
          fields.primaryTheme,
          fields.secondaryThemes.join(", ") || "None",
          fields.sessionObjectives,
          fields.expectedOutcomes,
          fields.sessionDetails,
          fields.speakerList,
          fields.resourceRequirements,
          fields.financialResources,
          fields.diversityStatement,
          fields.conflictOfInterest,
          fields.conflictDetails || "",
        ]],
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Workshop submission error:", err);
    return { error: "Something went wrong. Please try again." };
  }
}
