"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarDays, Info } from "lucide-react";
import { sendAbstractSubmission } from "./actions";
import { CountrySelect } from "./country-select";
import { Snackbar } from "./snackbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SubmitButton({ formValid }: { formValid: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="gtpSecondary"
      type="submit"
      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending || !formValid}
    >
      {pending ? "Submitting…" : "Submit Abstract"}
    </Button>
  );
}

interface WordCountInputProps {
  id: string;
  name: string;
  label: string;
  helper?: string;
  maxWords: number;
  required?: boolean;
  multiline?: boolean;
  placeholder?: string;
}

function WordCountField({
  id, name, label, helper, maxWords, required, multiline, placeholder,
}: WordCountInputProps) {
  const [value, setValue] = useState("");
  const wordCount = countWords(value);
  const atLimit = wordCount >= maxWords;

  const sharedClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const raw = e.target.value;
    const words = raw.trim() === "" ? [] : raw.trim().split(/\s+/);
    if (words.length > maxWords) {
      // Hard-cap: keep only the first maxWords words, preserve a trailing space
      // so the caret stays natural after the last word
      setValue(words.slice(0, maxWords).join(" "));
    } else {
      setValue(raw);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gtp-dark-teal">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {helper && <p className="mb-1.5 text-xs text-gray-400">{helper}</p>}
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={sharedClass}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={sharedClass}
        />
      )}
      <p className={`mt-1 text-right text-xs ${atLimit ? "font-medium text-red-500" : "text-gray-400"}`}>
        {wordCount} / {maxWords} words{atLimit ? " — limit reached" : ""}
      </p>
    </div>
  );
}

interface RadioGroupProps {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  columns?: 1 | 2;
}

function RadioGroup({ name, label, options, required, columns = 1 }: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gtp-dark-teal">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </legend>
      <div className={`grid gap-2 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors has-[:checked]:border-gtp-teal has-[:checked]:bg-gtp-teal/5 has-[:checked]:text-gtp-dark-teal"
          >
            <input type="radio" name={name} value={opt} required={required} className="accent-gtp-teal" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="pt-2">
      <h3 className="font-heading text-base font-bold text-gtp-dark-teal">{title}</h3>
      <div className="mt-1.5 h-px w-full bg-gray-200" />
    </div>
  );
}

// ─── Form Header ──────────────────────────────────────────────────────────────

function AbstractFormHeader() {
  return (
    <div className="space-y-5 border-b border-gray-200 pb-6">
      <div>
        <h2 className="font-heading text-xl font-bold leading-snug text-gtp-dark-teal">
          Global Tipping Points Conference 2026
        </h2>
        <p className="mt-0.5 font-heading text-base font-semibold text-gtp-teal">
          Call for Abstracts Submission Form
        </p>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">
        Building on the transformative insights of the{" "}
        <strong>Global Tipping Points Report 2025</strong>, this conference
        accelerates scientific understanding of critical thresholds that will
        determine our collective future. GTP 2026 focuses on{" "}
        <em>Understanding the Shift</em>, <em>Igniting Imagination</em>, and{" "}
        <em>Accelerating Action</em> across planetary boundaries.
      </p>

      <p className="text-sm leading-relaxed text-gray-600">
        We invite submissions advancing scientific understanding across Earth
        Systems Science, Technology and AI, Governance, Finance and Business,
        Faith and Culture, Communications, Nature-based Solutions, and Health.
        Topics focusing on Asian contexts where solutions are emerging at scale
        are particularly encouraged.
      </p>

      {/* Submission Guidelines */}
      <div className="rounded-xl border border-gtp-teal/20 bg-gtp-teal/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0 text-gtp-teal" />
          <span className="text-sm font-semibold text-gtp-dark-teal">Submission Guidelines</span>
        </div>
        <ul className="space-y-1 text-sm text-gray-600">
          <li>• <strong>Abstract title:</strong> Maximum 25 words</li>
          <li>• <strong>Abstract length:</strong> Maximum 300 words — not including title, author list and affiliation</li>
          <li>• <strong>Submission limit:</strong> Every author can submit only two abstracts as the presenting author, but can participate in several abstracts as a co-author</li>
        </ul>
      </div>

      {/* Important Dates */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">Important Dates</span>
        </div>
        <ul className="space-y-1 text-sm text-amber-700">
          <li>• <strong>Submission deadline:</strong> 15th May 2026, 23:59 (GMT+8)</li>
          <li>• <strong>Decision notification:</strong> 15th June 2026</li>
        </ul>
      </div>

      <p className="text-xs text-gray-500">
        For enquiries, contact{" "}
        <a
          href="mailto:scph_gtpc2026@sunway.edu.my?subject=Abstract Submission Inquiry"
          className="text-gtp-teal underline underline-offset-2 hover:text-gtp-dark-teal"
        >
          scph_gtpc2026@sunway.edu.my
        </a>{" "}
        with the subject line: <em>Abstract Submission Inquiry</em>.
      </p>

      <p className="text-xs font-medium text-gray-700">
        This form must be completed by the presenting author (oral/poster).
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const THEMES = [
  "Earth Systems Science",
  "Technology and AI",
  "Governance",
  "Finance and Business",
  "Faith and Culture",
  "Communications",
  "Nature-based Solutions",
  "Health",
];

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal";

function Field({
  id, name, label, type = "text", placeholder, required,
}: {
  id: string; name: string; label: string; type?: string;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gtp-dark-teal">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder ?? "Your answer"}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

// ─── Inner form (remounted on success to reset all state) ────────────────────

function AbstractFormContent({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction] = useActionState(sendAbstractSubmission, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isValid, setIsValid] = useState(false);

  function handleChange() {
    setIsValid(formRef.current?.checkValidity() ?? false);
  }

  useEffect(() => {
    if (state?.success) onSuccess();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} onChange={handleChange} className="space-y-6">
      <AbstractFormHeader />

      {/* Section 1 — Presenter Details */}
      <div className="space-y-4">
        <SectionDivider title="Presenter Details" />

        <Field id="email" name="email" label="Email" type="email" required />
        <Field
          id="fullName"
          name="fullName"
          label="Title & Full Name (First Name, Last Name)"
          required
        />
        <Field id="institution" name="institution" label="Institution" required />
        <Field
          id="designation"
          name="designation"
          label="Designation"
          placeholder="If studying, indicate Student"
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gtp-dark-teal">
            Country<span className="ml-1 text-red-500">*</span>
          </label>
          <CountrySelect name="country" required onValidityChange={handleChange} />
        </div>

        <RadioGroup
          name="earlyCareer"
          label="Are you an early career researcher? (Within 5 years of completing a PhD)"
          options={["Yes", "No"]}
          required
        />
      </div>

      {/* Section 2 — Submission Details */}
      <div className="space-y-4">
        <SectionDivider title="Submission Details" />

        <RadioGroup
          name="primaryTheme"
          label="Primary Theme (select one)"
          options={THEMES}
          required
          columns={2}
        />

        <RadioGroup
          name="presentationPreference"
          label="Presentation preference (subject to committee approval)"
          options={["Oral", "Poster"]}
          required
        />

        <WordCountField
          id="abstractTitle"
          name="abstractTitle"
          label="Abstract title"
          maxWords={25}
          required
          placeholder="Your abstract title"
        />

        <WordCountField
          id="abstract"
          name="abstract"
          label="Abstract"
          helper="Not including title, author list and affiliation"
          maxWords={300}
          required
          multiline
          placeholder="Write your abstract here…"
        />

        <div>
          <label
            htmlFor="authorList"
            className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
          >
            Author list and affiliation
            <span className="ml-1 text-red-500">*</span>
          </label>
          <textarea
            id="authorList"
            name="authorList"
            rows={3}
            required
            placeholder="e.g. John Doe (Sunway University, Malaysia), Jane Doe (University of Oxford, UK)"
            className={inputClass}
          />
        </div>
      </div>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {state.error}
        </div>
      )}

      <SubmitButton formValid={isValid} />
    </form>
  );
}

// ─── Public wrapper — manages reset key + snackbar ────────────────────────────

export function AbstractForm() {
  const [resetKey, setResetKey] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  function handleSuccess() {
    setShowSnackbar(true);
    setResetKey((k) => k + 1);
  }

  return (
    <>
      <AbstractFormContent key={resetKey} onSuccess={handleSuccess} />
      <Snackbar
        show={showSnackbar}
        message="Abstract submitted successfully! We will be in touch by 15th June 2026."
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}
