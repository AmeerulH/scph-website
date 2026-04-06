"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, CalendarDays, Info } from "lucide-react";
import { FullPageLoadingOverlay } from "@/components/navigation/full-page-loading-overlay";
import type { GtpAbstractFormCopy } from "@/sanity/gtp-submissions-form-defaults";
import { sendAbstractSubmission } from "./actions";
import { CountrySelect } from "./country-select";
import { Snackbar } from "./snackbar";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function SubmitButton({
  formValid,
  idleLabel,
  pendingLabel,
}: {
  formValid: boolean;
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="gtpSecondary"
      type="submit"
      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending || !formValid}
    >
      {pending ? pendingLabel : idleLabel}
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
  limitReachedSuffix: string;
}

function WordCountField({
  id,
  name,
  label,
  helper,
  maxWords,
  required,
  multiline,
  placeholder,
  limitReachedSuffix,
}: WordCountInputProps) {
  const [value, setValue] = useState("");
  const wordCount = countWords(value);
  const atLimit = wordCount >= maxWords;

  const sharedClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const raw = e.target.value;
    const words = raw.trim() === "" ? [] : raw.trim().split(/\s+/);
    if (words.length > maxWords) {
      setValue(words.slice(0, maxWords).join(" "));
    } else {
      setValue(raw);
    }
  }

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
      >
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
      <p
        className={`mt-1 text-right text-xs ${atLimit ? "font-medium text-red-500" : "text-gray-400"}`}
      >
        {wordCount} / {maxWords} words{atLimit ? limitReachedSuffix : ""}
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

function RadioGroup({
  name,
  label,
  options,
  required,
  columns = 1,
}: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gtp-dark-teal">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </legend>
      <div
        className={`grid gap-2 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors has-[:checked]:border-gtp-teal has-[:checked]:bg-gtp-teal/5 has-[:checked]:text-gtp-dark-teal"
          >
            <input
              type="radio"
              name={name}
              value={opt}
              required={required}
              className="accent-gtp-teal"
            />
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
      <h3 className="font-heading text-base font-bold text-gtp-dark-teal">
        {title}
      </h3>
      <div className="mt-1.5 h-px w-full bg-gray-200" />
    </div>
  );
}

function AbstractFormHeader({
  fc,
}: {
  fc: GtpAbstractFormCopy;
}) {
  return (
    <div className="space-y-5 border-b border-gray-200 pb-6">
      <div>
        <h2 className="font-heading text-xl font-bold leading-snug text-gtp-dark-teal">
          {fc.headerTitle}
        </h2>
        <p className="mt-0.5 font-heading text-base font-semibold text-gtp-teal">
          {fc.headerSubtitle}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">
        {fc.introParagraph1}
      </p>

      <p className="text-sm leading-relaxed text-gray-600">
        {fc.introParagraph2}
      </p>

      <div className="rounded-xl border border-gtp-teal/20 bg-gtp-teal/5 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 flex-shrink-0 text-gtp-teal" />
          <span className="text-sm font-semibold text-gtp-dark-teal">
            {fc.guidelinesTitle}
          </span>
        </div>
        <ul className="space-y-1 text-sm text-gray-600">
          {fc.guidelinesBullets.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">
            {fc.importantDatesTitle}
          </span>
        </div>
        <ul className="space-y-1 text-sm text-amber-700">
          {fc.importantDatesBullets.map((line) => (
            <li key={line}>• {line}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-500">
        {fc.contactLead}{" "}
        <a
          href={`mailto:${fc.contactEmail}?subject=${encodeURIComponent(fc.contactMailtoSubject)}`}
          className="text-gtp-teal underline underline-offset-2 hover:text-gtp-dark-teal"
        >
          {fc.contactEmail}
        </a>{" "}
        with the subject line: <em>{fc.contactSubjectEmphasis}</em>.
      </p>

      <p className="text-xs font-medium text-gray-700">{fc.presentingAuthorNote}</p>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal";

function Field({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required,
  genericPlaceholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  genericPlaceholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder ?? genericPlaceholder}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

function AbstractFormContent({
  abstractForm: fc,
  themeTitles,
  onSuccess,
}: {
  abstractForm: GtpAbstractFormCopy;
  themeTitles: string[];
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    sendAbstractSubmission,
    null,
  );
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
    <form
      ref={formRef}
      action={formAction}
      onChange={handleChange}
      className="space-y-6"
    >
      {isPending ? (
        <FullPageLoadingOverlay variant="gtp" label={fc.overlaySubmittingLabel} />
      ) : null}
      <AbstractFormHeader fc={fc} />

      <div className="space-y-4">
        <SectionDivider title={fc.sectionPresenterDetails} />

        <Field
          id="email"
          name="email"
          label={fc.labelEmail}
          type="email"
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <Field
          id="fullName"
          name="fullName"
          label={fc.labelFullName}
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <Field
          id="institution"
          name="institution"
          label={fc.labelInstitution}
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <Field
          id="designation"
          name="designation"
          label={fc.labelDesignation}
          placeholder={fc.designationPlaceholder}
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gtp-dark-teal">
            {fc.labelCountry}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <CountrySelect
            name="country"
            required
            onValidityChange={handleChange}
          />
        </div>

        <RadioGroup
          name="earlyCareer"
          label={fc.labelEarlyCareerQuestion}
          options={[fc.earlyCareerYesLabel, fc.earlyCareerNoLabel]}
          required
        />
      </div>

      <div className="space-y-4">
        <SectionDivider title={fc.sectionSubmissionDetails} />

        <RadioGroup
          name="primaryTheme"
          label={fc.labelPrimaryTheme}
          options={themeTitles}
          required
          columns={2}
        />

        <RadioGroup
          name="presentationPreference"
          label={fc.labelPresentationPreference}
          options={[fc.presentationOralLabel, fc.presentationPosterLabel]}
          required
        />

        <WordCountField
          id="abstractTitle"
          name="abstractTitle"
          label={fc.labelAbstractTitle}
          maxWords={fc.abstractTitleMaxWords}
          required
          placeholder={fc.placeholderAbstractTitle}
          limitReachedSuffix={fc.wordCountLimitReachedSuffix}
        />

        <WordCountField
          id="abstract"
          name="abstract"
          label={fc.labelAbstract}
          helper={fc.helperAbstract}
          maxWords={fc.abstractBodyMaxWords}
          required
          multiline
          placeholder={fc.placeholderAbstract}
          limitReachedSuffix={fc.wordCountLimitReachedSuffix}
        />

        <div>
          <label
            htmlFor="authorList"
            className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
          >
            {fc.labelAuthorList}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <textarea
            id="authorList"
            name="authorList"
            rows={3}
            required
            placeholder={fc.placeholderAuthorList}
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

      <SubmitButton
        formValid={isValid}
        idleLabel={fc.submitButtonIdle}
        pendingLabel={fc.submitButtonSubmitting}
      />
    </form>
  );
}

export function AbstractForm({
  abstractForm,
  themeTitles,
}: {
  abstractForm: GtpAbstractFormCopy;
  themeTitles: string[];
}) {
  const [resetKey, setResetKey] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  function handleSuccess() {
    setShowSnackbar(true);
    setResetKey((k) => k + 1);
  }

  return (
    <>
      <AbstractFormContent
        key={resetKey}
        abstractForm={abstractForm}
        themeTitles={themeTitles}
        onSuccess={handleSuccess}
      />
      <Snackbar
        show={showSnackbar}
        message={abstractForm.successSnackbarMessage}
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}
