"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarDays,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FullPageLoadingOverlay } from "@/components/navigation/full-page-loading-overlay";
import type { GtpWorkshopFormCopy } from "@/sanity/gtp-submissions-form-defaults";
import { sendWorkshopSubmission } from "./actions";
import {
  WORKSHOP_CONFLICT_HAS_CONFLICTS_VALUE,
  WORKSHOP_CONFLICT_NO_CONFLICTS_VALUE,
} from "./form-value-constants";
import { CountrySelect } from "./country-select";
import { Snackbar } from "./snackbar";

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
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
  helper,
  genericPlaceholder,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
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
      {helper && <p className="mb-1.5 text-xs text-gray-400">{helper}</p>}
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

function TextareaField({
  id,
  name,
  label,
  placeholder,
  required,
  helper,
  rows = 4,
}: {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
  rows?: number;
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
      {helper && (
        <p className="mb-2 whitespace-pre-line text-xs leading-relaxed text-gray-500">
          {helper}
        </p>
      )}
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function WordCountField({
  id,
  name,
  label,
  maxWords,
  required,
  placeholder,
  helper,
  limitReachedSuffix,
}: {
  id: string;
  name: string;
  label: string;
  maxWords: number;
  required?: boolean;
  placeholder?: string;
  helper?: string;
  limitReachedSuffix: string;
}) {
  const [value, setValue] = useState("");
  const wordCount = countWords(value);
  const atLimit = wordCount >= maxWords;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      <input
        id={id}
        name={name}
        type="text"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={inputClass}
      />
      <p
        className={`mt-1 text-right text-xs ${atLimit ? "font-medium text-red-500" : "text-gray-400"}`}
      >
        {wordCount} / {maxWords} words{atLimit ? limitReachedSuffix : ""}
      </p>
    </div>
  );
}

function RadioGroup({
  name,
  label,
  options,
  required,
  columns = 1,
  onValueChange,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  columns?: 1 | 2;
  onValueChange?: (value: string) => void;
}) {
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
              onChange={() => onValueChange?.(opt)}
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

function RequirementsPanel({ fc }: { fc: GtpWorkshopFormCopy }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-gtp-dark-teal"
      >
        <span className="flex items-center gap-2">
          <Info className="h-4 w-4 text-gtp-teal" />
          {fc.requirementsPanelTitle}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="space-y-4 border-t border-gray-200 px-4 pb-4 pt-3 text-gray-600">
          {fc.requirementsSections.map((section) => (
            <div key={section.title}>
              <p className="font-semibold text-gtp-dark-teal">{section.title}</p>
              {section.intro ? (
                <p className="mt-1 text-xs leading-relaxed">{section.intro}</p>
              ) : null}
              <ul className="mt-1 space-y-0.5 pl-3 text-xs">
                {section.bullets.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
              {section.footer ? (
                <p className="mt-1 text-xs text-gray-500">{section.footer}</p>
              ) : null}
            </div>
          ))}

          <div>
            <p className="font-semibold text-gtp-dark-teal">
              {fc.evaluationCriteriaTitle}
            </p>
            <div className="mt-1 grid gap-2 text-xs sm:grid-cols-2">
              {fc.evaluationGroups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-lg bg-white p-2.5 ring-1 ring-gray-100"
                >
                  <p className="font-semibold text-gtp-dark-teal">{group.title}</p>
                  <ul className="mt-1 space-y-0.5 pl-2">
                    {group.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorkshopFormHeader({
  fc,
  themeTitles,
}: {
  fc: GtpWorkshopFormCopy;
  themeTitles: string[];
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

      <p className="text-sm leading-relaxed text-gray-600">
        {fc.introParagraph3}
      </p>

      <div className="rounded-xl border border-gtp-teal/20 bg-gtp-teal/5 p-4">
        <p className="mb-2 text-sm font-semibold text-gtp-dark-teal">
          {fc.pillarsThemesCalloutTitle}
        </p>
        <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
          {themeTitles.map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gtp-teal" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <RequirementsPanel fc={fc} />

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

      <p className="text-xs text-gray-500">{fc.registrationFeeNote}</p>
    </div>
  );
}

function SecondaryThemesField({
  primaryTheme,
  selected,
  onSelectedChange,
  themeTitles,
  fc,
}: {
  primaryTheme: string;
  selected: string[];
  onSelectedChange: Dispatch<SetStateAction<string[]>>;
  themeTitles: string[];
  fc: GtpWorkshopFormCopy;
}) {
  function toggle(theme: string) {
    if (theme === primaryTheme) return;
    onSelectedChange((prev) => {
      if (prev.includes(theme)) return prev.filter((t) => t !== theme);
      if (prev.length >= 2) return prev;
      return [...prev, theme];
    });
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gtp-dark-teal">
        {fc.labelSecondaryThemes}{" "}
        <span className="font-normal text-gray-400">{fc.secondaryThemesHint}</span>
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {themeTitles.map((theme) => {
          const isPrimary = Boolean(primaryTheme && theme === primaryTheme);
          const isSelected = selected.includes(theme);
          const atCap = !isSelected && selected.length >= 2;
          const isDisabled = isPrimary || atCap;
          return (
            <label
              key={theme}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                isPrimary
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : isSelected
                    ? "border-gtp-teal bg-gtp-teal/5 text-gtp-dark-teal"
                    : isDisabled
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                      : "border-gray-200 text-gray-700 hover:border-gtp-teal/40"
              }`}
            >
              <input
                type="checkbox"
                name="secondaryThemes"
                value={theme}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggle(theme)}
                className="accent-gtp-teal"
              />
              {theme}
              {isPrimary ? (
                <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  {fc.secondaryThemesPrimaryBadge}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      {selected.length >= 2 && (
        <p className="mt-1 text-xs text-amber-600">
          {fc.secondaryThemesMaxSelectedNote}
        </p>
      )}
    </fieldset>
  );
}

function WorkshopFormContent({
  workshopForm: fc,
  themeTitles,
  onSuccess,
}: {
  workshopForm: GtpWorkshopFormCopy;
  themeTitles: string[];
  onSuccess: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    sendWorkshopSubmission,
    null,
  );
  const [conflictValue, setConflictValue] = useState("");
  const [primaryTheme, setPrimaryTheme] = useState("");
  const [secondaryThemes, setSecondaryThemes] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const [isValid, setIsValid] = useState(false);

  function handleChange() {
    setIsValid(formRef.current?.checkValidity() ?? false);
  }

  useEffect(() => {
    setIsValid(formRef.current?.checkValidity() ?? false);
  }, [conflictValue]);

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
      <WorkshopFormHeader fc={fc} themeTitles={themeTitles} />

      <div className="space-y-4">
        <SectionDivider title={fc.sectionConvenerDetails} />
        <Field
          id="w-email"
          name="email"
          label={fc.labelEmail}
          type="email"
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <Field
          id="w-fullName"
          name="fullName"
          label={fc.labelFullName}
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <Field
          id="w-institution"
          name="institution"
          label={fc.labelInstitution}
          required
          genericPlaceholder={fc.fieldGenericPlaceholder}
        />
        <Field
          id="w-designation"
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
      </div>

      <div className="space-y-4">
        <SectionDivider title={fc.sectionSessionOverview} />

        <WordCountField
          id="sessionTitle"
          name="sessionTitle"
          label={fc.labelProposedSessionTitle}
          maxWords={fc.sessionTitleMaxWords}
          required
          placeholder={fc.placeholderSessionTitle}
          limitReachedSuffix={fc.wordCountLimitReachedSuffix}
        />

        <RadioGroup
          name="primaryPillar"
          label={fc.labelPrimaryPillar}
          options={fc.primaryPillarOptions}
          required
        />

        <RadioGroup
          name="primaryTheme"
          label={fc.labelPrimaryThematicArea}
          options={themeTitles}
          required
          columns={2}
          onValueChange={(value) => {
            setPrimaryTheme(value);
            setSecondaryThemes((prev) => prev.filter((t) => t !== value));
          }}
        />

        <SecondaryThemesField
          primaryTheme={primaryTheme}
          selected={secondaryThemes}
          onSelectedChange={setSecondaryThemes}
          themeTitles={themeTitles}
          fc={fc}
        />
      </div>

      <div className="space-y-4">
        <SectionDivider title={fc.sectionSessionOutline} />

        <TextareaField
          id="sessionObjectives"
          name="sessionObjectives"
          label={fc.labelSessionObjectives}
          placeholder={fc.placeholderSessionObjectives}
          required
          rows={4}
        />

        <TextareaField
          id="expectedOutcomes"
          name="expectedOutcomes"
          label={fc.labelExpectedOutcomes}
          helper={fc.helperExpectedOutcomes}
          required
          rows={4}
        />

        <TextareaField
          id="sessionDetails"
          name="sessionDetails"
          label={fc.labelSessionDetails}
          helper={fc.helperSessionDetails}
          required
          rows={6}
        />

        <TextareaField
          id="speakerList"
          name="speakerList"
          label={fc.labelSpeakerList}
          helper={fc.helperSpeakerList}
          required
          rows={5}
        />
      </div>

      <div className="space-y-4">
        <SectionDivider title={fc.sectionResourceRequirements} />

        <TextareaField
          id="resourceRequirements"
          name="resourceRequirements"
          label={fc.labelResourceRequirements}
          helper={fc.helperResourceRequirements}
          required
          rows={5}
        />

        <RadioGroup
          name="financialResources"
          label={fc.labelFinancialResources}
          options={[
            fc.financialOptionYes,
            fc.financialOptionNo,
            fc.financialOptionUncertain,
          ]}
          required
        />
      </div>

      <div className="space-y-4">
        <SectionDivider title={fc.sectionDeclaration} />

        <TextareaField
          id="diversityStatement"
          name="diversityStatement"
          label={fc.labelDiversityStatement}
          placeholder={fc.placeholderDiversityStatement}
          required
          rows={4}
        />

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gtp-dark-teal">
            {fc.labelConflictOfInterest}
            <span className="ml-1 text-red-500">*</span>
          </legend>
          <p className="mb-3 text-xs leading-relaxed text-gray-500">
            {fc.conflictIntro}
          </p>
          <div className="grid gap-2">
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors has-[:checked]:border-gtp-teal has-[:checked]:bg-gtp-teal/5 has-[:checked]:text-gtp-dark-teal">
              <input
                type="radio"
                name="conflictOfInterest"
                value={WORKSHOP_CONFLICT_NO_CONFLICTS_VALUE}
                required
                className="accent-gtp-teal"
                onChange={() => setConflictValue(WORKSHOP_CONFLICT_NO_CONFLICTS_VALUE)}
              />
              {fc.conflictOptionNoConflicts}
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors has-[:checked]:border-gtp-teal has-[:checked]:bg-gtp-teal/5 has-[:checked]:text-gtp-dark-teal">
              <input
                type="radio"
                name="conflictOfInterest"
                value={WORKSHOP_CONFLICT_HAS_CONFLICTS_VALUE}
                required
                className="accent-gtp-teal"
                onChange={() => setConflictValue(WORKSHOP_CONFLICT_HAS_CONFLICTS_VALUE)}
              />
              {fc.conflictOptionHasConflicts}
            </label>
          </div>
        </fieldset>

        {conflictValue === WORKSHOP_CONFLICT_HAS_CONFLICTS_VALUE && (
          <div>
            <label
              htmlFor="conflictDetails"
              className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
            >
              {fc.labelConflictDetails}
              <span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              id="conflictDetails"
              name="conflictDetails"
              rows={3}
              required
              placeholder={fc.placeholderConflictDetails}
              className={inputClass}
            />
          </div>
        )}
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

export function WorkshopForm({
  workshopForm,
  themeTitles,
}: {
  workshopForm: GtpWorkshopFormCopy;
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
      <WorkshopFormContent
        key={resetKey}
        workshopForm={workshopForm}
        themeTitles={themeTitles}
        onSuccess={handleSuccess}
      />
      <Snackbar
        show={showSnackbar}
        message={workshopForm.successSnackbarMessage}
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}
