"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESOURCE_THEMES, RESOURCE_TYPES } from "@/lib/mpn/filter-options";
import type { MpnWorkshop } from "@/lib/mpn/resource-types";

export function ResourceUploadForm({ workshops }: { workshops: MpnWorkshop[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [visibility, setVisibility] = useState("members");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const response = await fetch("/api/mpn/resources/upload", {
      method: "POST",
      body: new FormData(form),
    });
    const payload = (await response.json()) as {
      data: { resource: { title: string } } | null;
      error: { message?: string } | null;
    };

    if (!response.ok || !payload.data) {
      setError(payload.error?.message ?? "Unable to upload this resource.");
      setIsSubmitting(false);
      return;
    }

    form.reset();
    setVisibility("members");
    setSuccess(`${payload.data.resource.title} is now in the resource library.`);
    setIsSubmitting(false);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title" required>
          <input className={inputClassName} name="title" required />
        </Field>
        <Field label="Source">
          <input className={inputClassName} name="source" placeholder="Organisation or publisher" />
        </Field>
        <Field label="Type" required>
          <select className={inputClassName} defaultValue="" name="type" required>
            <option disabled value="">Select type</option>
            {RESOURCE_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
        </Field>
        <Field label="Theme" required>
          <select className={inputClassName} defaultValue="" name="theme" required>
            <option disabled value="">Select theme</option>
            {RESOURCE_THEMES.map((theme) => <option key={theme}>{theme}</option>)}
          </select>
        </Field>
        <Field label="Publication date">
          <input className={inputClassName} name="published_date" type="date" />
        </Field>
        <Field label="Article URL">
          <input className={inputClassName} name="article_url" placeholder="https://…" type="url" />
        </Field>
      </div>

      <Field label="Description">
        <textarea className={`${inputClassName} min-h-28 resize-y`} name="description" />
      </Field>
      <Field label="Tags">
        <input className={inputClassName} name="tags" placeholder="Comma-separated tags" />
      </Field>

      <div className="grid gap-5 border-y border-slate-200 py-5 sm:grid-cols-2">
        <Field label="Who can download?" required>
          <select
            className={inputClassName}
            name="visibility"
            onChange={(event) => setVisibility(event.target.value)}
            value={visibility}
          >
            <option value="members">All signed-in MPN members</option>
            <option value="workshop_alumni">Matching workshop attendees</option>
            <option value="admins">Administrators only</option>
          </select>
        </Field>
        <Field label="Workshop">
          <select
            className={inputClassName}
            disabled={visibility !== "workshop_alumni"}
            name="workshop_id"
            defaultValue=""
          >
            <option value="">Select workshop</option>
            {workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.number}. {workshop.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="File">
        <input
          accept=".pdf,.docx,.xlsx,.xls,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-scph-blue/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-scph-blue hover:file:bg-scph-blue/20"
          name="file"
          type="file"
        />
        <p className="mt-1.5 text-xs text-slate-500">PDF, Word, or Excel, up to 25 MB.</p>
      </Field>

      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      {success ? <p className="text-sm font-medium text-scph-dark-green" role="status">{success}</p> : null}
      <Button className="w-fit" disabled={isSubmitting} type="submit" variant="scph">
        {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Upload />}
        {isSubmitting ? "Uploading…" : "Publish resource"}
      </Button>
    </form>
  );
}

const inputClassName =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-scph-blue focus:ring-2 focus:ring-scph-blue/20 disabled:cursor-not-allowed disabled:bg-slate-100";

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}{required ? <span className="text-scph-blue"> *</span> : null}
      {children}
    </label>
  );
}
