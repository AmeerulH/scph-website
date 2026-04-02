"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FullPageLoadingOverlay } from "@/components/navigation/full-page-loading-overlay";
import { Button } from "@/components/ui/button";
import { sendContactEmail } from "./actions";

function SubmitButton({ variant }: { variant: "gtpSecondary" | "scphSecondary" }) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={variant}
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Sending…" : "Send Message"}
    </Button>
  );
}

const fieldFocusGtp =
  "focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal";
const fieldFocusScph =
  "focus:border-scph-blue focus:outline-none focus:ring-1 focus:ring-scph-blue";

export function ContactForm({
  appearance = "gtp",
}: {
  /** Use `scph` when embedding on the main SCPH site (brand-aligned chrome). */
  appearance?: "gtp" | "scph";
}) {
  const [state, formAction, isPending] = useActionState(sendContactEmail, null);
  const isScph = appearance === "scph";
  const labelClass = isScph
    ? "text-scph-blue"
    : "text-gtp-dark-teal";
  const fieldFocus = isScph ? fieldFocusScph : fieldFocusGtp;
  const successClass = isScph
    ? "text-scph-dark-green"
    : "text-gtp-teal";

  return (
    <form action={formAction} className="space-y-4">
      {isPending ? (
        <FullPageLoadingOverlay
          variant={isScph ? "scph" : "gtp"}
          label="Sending your message"
        />
      ) : null}
      <div>
        <label
          htmlFor={isScph ? "scph-gtp-name" : "name"}
          className={`mb-1.5 block text-sm font-medium ${labelClass}`}
        >
          Name
        </label>
        <input
          id={isScph ? "scph-gtp-name" : "name"}
          name="name"
          type="text"
          placeholder="Your name"
          required
          className={`w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors ${fieldFocus}`}
        />
      </div>
      <div>
        <label
          htmlFor={isScph ? "scph-gtp-email" : "email"}
          className={`mb-1.5 block text-sm font-medium ${labelClass}`}
        >
          Email
        </label>
        <input
          id={isScph ? "scph-gtp-email" : "email"}
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className={`w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors ${fieldFocus}`}
        />
      </div>
      <div>
        <label
          htmlFor={isScph ? "scph-gtp-message" : "message"}
          className={`mb-1.5 block text-sm font-medium ${labelClass}`}
        >
          Message
        </label>
        <textarea
          id={isScph ? "scph-gtp-message" : "message"}
          name="message"
          rows={4}
          placeholder="How can we help?"
          required
          className={`w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors ${fieldFocus}`}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className={`text-sm font-medium ${successClass}`}>
          Thank you! Your message has been sent.
        </p>
      )}

      <SubmitButton variant={isScph ? "scphSecondary" : "gtpSecondary"} />
    </form>
  );
}
