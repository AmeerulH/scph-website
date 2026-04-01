"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CalendarDays,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { sendWorkshopSubmission } from "./actions";
import { CountrySelect } from "./country-select";
import { Snackbar } from "./snackbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 bg-white transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal";

// ─── Shared field building blocks ─────────────────────────────────────────────

function Field({
  id,
  name,
  label,
  type = "text",
  placeholder,
  required,
  helper,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  helper?: string;
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
        placeholder={placeholder ?? "Your answer"}
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
}: {
  id: string;
  name: string;
  label: string;
  maxWords: number;
  required?: boolean;
  placeholder?: string;
  helper?: string;
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

function SubmitButton({ formValid }: { formValid: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="gtpSecondary"
      type="submit"
      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={pending || !formValid}
    >
      {pending ? "Submitting…" : "Submit Workshop Proposal"}
    </Button>
  );
}

// ─── Collapsible requirements panel ──────────────────────────────────────────

function RequirementsPanel() {
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
          Action Workshop Requirements &amp; Evaluation Criteria
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="space-y-4 border-t border-gray-200 px-4 pb-4 pt-3 text-gray-600">
          <div>
            <p className="font-semibold text-gtp-dark-teal">Session Format</p>
            <ul className="mt-1 space-y-0.5 pl-3 text-xs">
              <li>• Duration: 1.5 hours</li>
              <li>
                • Structure: Clear objectives, engaging format and defined
                outcomes
              </li>
              <li>
                • Target Audience: Decision-makers, investors, cultural leaders
                and researchers
              </li>
              <li>
                • Engagement: Interactive elements to build confidence and
                courage to act
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gtp-dark-teal">Content Focus</p>
            <ul className="mt-1 space-y-0.5 pl-3 text-xs">
              <li>
                • <strong>Asian Context:</strong> Sessions demonstrating
                relevance to Asia and emerging economies will be given
                preference
              </li>
              <li>
                • <strong>Rapid Progress:</strong> Evidence of potential for
                systemic change and acceleration
              </li>
              <li>
                • <strong>Cross-Disciplinary:</strong> Integration of scientific
                understanding with cultural and ethical dimensions
              </li>
              <li>
                • <strong>Decision-Maker Focus:</strong> Language and structure
                designed for leaders who must act under uncertainty
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gtp-dark-teal">
              Expected Outcomes
            </p>
            <p className="mt-1 text-xs">
              Session conveners are expected to produce a short return summary
              of their session, for which a template will be proided in advance.
              Sessions should aim and report on tangible outcomes or identify:
            </p>
            <ul className="mt-1 space-y-0.5 pl-3 text-xs">
              <li>• Policy levers, investment signals, or narrative shifts</li>
              <li>• Case studies or evidence-based approaches</li>
              <li>
                • Actionable recommendations for intergovernmental processes,
                including UNFCCC COP31
              </li>
            </ul>
            <p className="mt-1 text-xs text-gray-500">
              Note that sessions that satisfy this criteria could possibly
              inform the Global Tipping Points Report 2027. Lead conveners may
              be contacted for a follow-up discussion post conference.
            </p>
          </div>

          <div>
            <p className="font-semibold text-gtp-dark-teal">
              Evaluation Criteria
            </p>
            <div className="mt-1 grid gap-2 text-xs sm:grid-cols-2">
              {[
                {
                  title: "Strategic Alignment",
                  items: [
                    "Connection to GTP Report 2025 findings",
                    "Alignment with the three-pillar approach",
                    "Potential to accelerate positive tipping points",
                  ],
                },
                {
                  title: "Impact Potential",
                  items: [
                    "Potential to inform policy decisions and investment signals",
                    "Capacity to generate narrative shifts",
                    "Scalability across Asia and emerging economies",
                  ],
                },
                {
                  title: "Design Quality",
                  items: [
                    "Engagement strategies for decision-makers",
                    "Balance between scientific rigour and accessibility",
                    "Innovation in format and delivery",
                  ],
                },
                {
                  title: "Representation & Diversity",
                  items: [
                    "Geographical diversity, especially Asian representation",
                    "Disciplinary and sectoral diversity",
                    "Gender and career stage balance",
                  ],
                },
                {
                  title: "Practical Feasibility",
                  items: [
                    "Resource requirements and venue suitability",
                    "Participant availability and commitment",
                    "Compliance with conference timeline",
                  ],
                },
              ].map(({ title, items }) => (
                <div
                  key={title}
                  className="rounded-lg bg-white p-2.5 ring-1 ring-gray-100"
                >
                  <p className="font-semibold text-gtp-dark-teal">{title}</p>
                  <ul className="mt-1 space-y-0.5 pl-2">
                    {items.map((item) => (
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

// ─── Form Header ──────────────────────────────────────────────────────────────

function WorkshopFormHeader() {
  return (
    <div className="space-y-5 border-b border-gray-200 pb-6">
      <div>
        <h2 className="font-heading text-xl font-bold leading-snug text-gtp-dark-teal">
          Global Tipping Points Conference 2026
        </h2>
        <p className="mt-0.5 font-heading text-base font-semibold text-gtp-teal">
          Call for Action Workshops
        </p>
      </div>

      <p className="text-sm leading-relaxed text-gray-600">
        Building on the transformative insights of the{" "}
        <strong>2025 Global Tipping Points Report</strong>, GTP 2026 brings
        together leading scientists, policymakers, industry leaders,
        practitioners and cultural stakeholders to accelerate positive tipping
        points across planetary boundaries.
      </p>

      <p className="text-sm leading-relaxed text-gray-600">
        The world is approaching a set of unavoidable decisions that will shape
        lives, communities, economies and ecosystems for generations. Research
        on tipping points shows that when the right mix of leadership,
        investment and public confidence comes together, change can accelerate.
      </p>

      <p className="text-sm leading-relaxed text-gray-600">
        We are seeking <strong>innovative 1.5-hour action workshops</strong>{" "}
        that identify where progress can move fastest and how leaders can unlock
        momentum. This call is designed for those who want to be part of shaping
        the next chapter, not simply reacting to it.
      </p>

      <div className="rounded-xl border border-gtp-teal/20 bg-gtp-teal/5 p-4">
        <p className="mb-2 text-sm font-semibold text-gtp-dark-teal">
          Workshops should align with one of the three conference pillars and
          contribute to any of the eight thematic areas:
        </p>
        <div className="grid grid-cols-2 gap-1 text-sm text-gray-600">
          {[
            "Earth Systems Science",
            "Technology and AI",
            "Governance",
            "Finance and Business",
            "Faith and Culture",
            "Communications",
            "Nature-based Solutions",
            "Health",
          ].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gtp-teal" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <RequirementsPanel />

      {/* Important Dates */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">
            Important Dates
          </span>
        </div>
        <ul className="space-y-1 text-sm text-amber-700">
          <li>
            • <strong>Submission deadline:</strong> 8th May 2026, 23:59 (GMT+8)
          </li>
          <li>
            • <strong>Notification of acceptance:</strong> 5th June 2026
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-500">
        For inquiries, contact{" "}
        <a
          href="mailto:scph_gtpc2026@sunway.edu.my?subject=Action Workshop Inquiry - [Your Topic]"
          className="text-gtp-teal underline underline-offset-2 hover:text-gtp-dark-teal"
        >
          scph_gtpc2026@sunway.edu.my
        </a>{" "}
        with the subject line: <em>Action Workshop Inquiry — [Your Topic]</em>.
      </p>

      <p className="text-xs text-gray-500">
        <strong>Note:</strong> Registration fee will be waived for
        speakers/facilitators.
      </p>
    </div>
  );
}

// ─── Secondary Themes Checkbox Group ─────────────────────────────────────────

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

function SecondaryThemesField() {
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(theme: string) {
    setSelected((prev) => {
      if (prev.includes(theme)) return prev.filter((t) => t !== theme);
      if (prev.length >= 2) return prev;
      return [...prev, theme];
    });
  }

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gtp-dark-teal">
        Secondary Thematic Area(s){" "}
        <span className="font-normal text-gray-400">
          (optional — select up to 2)
        </span>
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {THEMES.map((theme) => {
          const isSelected = selected.includes(theme);
          const isDisabled = !isSelected && selected.length >= 2;
          return (
            <label
              key={theme}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                isSelected
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
            </label>
          );
        })}
      </div>
      {selected.length >= 2 && (
        <p className="mt-1 text-xs text-amber-600">
          Maximum of 2 secondary themes selected.
        </p>
      )}
    </fieldset>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Inner form (remounted on success to reset all state) ────────────────────

function WorkshopFormContent({ onSuccess }: { onSuccess: () => void }) {
  const [state, formAction] = useActionState(sendWorkshopSubmission, null);
  const [conflictValue, setConflictValue] = useState("");
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
      <WorkshopFormHeader />

      {/* Section 1 — Convener Details */}
      <div className="space-y-4">
        <SectionDivider title="Convener Details" />
        <Field id="w-email" name="email" label="Email" type="email" required />
        <Field
          id="w-fullName"
          name="fullName"
          label="Title & Full Name (First Name, Last Name)"
          required
        />
        <Field
          id="w-institution"
          name="institution"
          label="Institution / Organisation"
          required
        />
        <Field
          id="w-designation"
          name="designation"
          label="Designation"
          placeholder="If studying, indicate Student"
          required
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gtp-dark-teal">
            Country<span className="ml-1 text-red-500">*</span>
          </label>
          <CountrySelect
            name="country"
            required
            onValidityChange={handleChange}
          />
        </div>
      </div>

      {/* Section 2 — Session Overview */}
      <div className="space-y-4">
        <SectionDivider title="Session Overview" />

        <WordCountField
          id="sessionTitle"
          name="sessionTitle"
          label="Proposed Session Title"
          maxWords={10}
          required
          placeholder="Your session title"
        />

        <RadioGroup
          name="primaryPillar"
          label="Primary Conference Pillar (select one)"
          options={[
            "Understanding the Shift",
            "Igniting Imagination",
            "Accelerating Action",
            "Cross-pillar Integration",
          ]}
          required
        />

        <RadioGroup
          name="primaryTheme"
          label="Primary Thematic Area (select one)"
          options={THEMES}
          required
          columns={2}
        />

        <SecondaryThemesField />
      </div>

      {/* Section 3 — Session Outline */}
      <div className="space-y-4">
        <SectionDivider title="Session Outline" />

        <TextareaField
          id="sessionObjectives"
          name="sessionObjectives"
          label="Session Objectives"
          placeholder="List specific, measurable objectives for your session…"
          required
          rows={4}
        />

        <TextareaField
          id="expectedOutcomes"
          name="expectedOutcomes"
          label="Expected Outcomes"
          helper="Include specific connection to Asian contexts, evidence of acceleration potential, regional partnerships and scalability…"
          required
          rows={4}
        />

        <TextareaField
          id="sessionDetails"
          name="sessionDetails"
          label="Session Details"
          helper={`Provide details covering:\n1. Session Format — describe the structure & format\n2. Session Overview — state a brief agenda\n3. Engagement Strategies — how will you ensure active participation?\n4. Interactive Elements — any specific activities or tools used?`}
          required
          rows={6}
        />

        <TextareaField
          id="speakerList"
          name="speakerList"
          label="Proposed Speaker / Facilitator / Moderator List (max 5 individuals)"
          helper={`Format:\n1. Lead Facilitator: Professor John Doe (Sunway University, Malaysia)\n2. Facilitator: Assoc. Prof. Jane Doe (Sunway Centre for Planetary Health, Malaysia)\n3. …`}
          required
          rows={5}
        />
      </div>

      {/* Section 4 — Resource Requirements */}
      <div className="space-y-4">
        <SectionDivider title="Resource Requirements" />

        <TextareaField
          id="resourceRequirements"
          name="resourceRequirements"
          label="Technical, Venue &amp; Special Requirements"
          helper={`Please describe:\n• Technical needs (equipment, technology or technical support)\n• Venue requirements (room setup or space needs)\n• Special requirements (interpretation, accessibility, etc.)\n• Any other related resource requirements`}
          required
          rows={5}
        />

        <RadioGroup
          name="financialResources"
          label="Do you have the financial resources to fund costs associated with your workshop? (costs include speaker transport and accommodation; the conference host provides venue and basic AV)"
          options={["Yes", "No", "Uncertain"]}
          required
        />
      </div>

      {/* Section 5 — Declaration and Acknowledgement */}
      <div className="space-y-4">
        <SectionDivider title="Declaration and Acknowledgement" />

        <TextareaField
          id="diversityStatement"
          name="diversityStatement"
          label="Diversity Statement"
          placeholder="How does this session ensure diverse representation? (Consider geographical diversity, disciplinary and sectoral diversity, inclusion of cultural and ethical perspectives, gender and career stage balance)"
          required
          rows={4}
        />

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gtp-dark-teal">
            Conflict of Interest
            <span className="ml-1 text-red-500">*</span>
          </legend>
          <p className="mb-3 text-xs leading-relaxed text-gray-500">
            I declare that I have no conflicts of interest with other special
            session proposals or potential participants. Any known conflicts
            will be disclosed immediately.
          </p>
          <div className="grid gap-2">
            {[
              "Yes, I have no conflicts of interest",
              "No, I have conflicts",
            ].map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 transition-colors has-[:checked]:border-gtp-teal has-[:checked]:bg-gtp-teal/5 has-[:checked]:text-gtp-dark-teal"
              >
                <input
                  type="radio"
                  name="conflictOfInterest"
                  value={opt}
                  required
                  className="accent-gtp-teal"
                  onChange={() => setConflictValue(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>

        {conflictValue === "No, I have conflicts" && (
          <div>
            <label
              htmlFor="conflictDetails"
              className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
            >
              Please specify your conflicts
              <span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              id="conflictDetails"
              name="conflictDetails"
              rows={3}
              required
              placeholder="Describe the nature of your conflicts of interest…"
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

      <SubmitButton formValid={isValid} />
    </form>
  );
}

// ─── Public wrapper — manages reset key + snackbar ────────────────────────────

export function WorkshopForm() {
  const [resetKey, setResetKey] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);

  function handleSuccess() {
    setShowSnackbar(true);
    setResetKey((k) => k + 1);
  }

  return (
    <>
      <WorkshopFormContent key={resetKey} onSuccess={handleSuccess} />
      <Snackbar
        show={showSnackbar}
        message="Workshop proposal submitted successfully! We will be in touch by 6th June 2026."
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}
