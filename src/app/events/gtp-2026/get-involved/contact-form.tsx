"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { sendContactEmail } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="gtpSecondary"
      type="submit"
      className="w-full"
      disabled={pending}
    >
      {pending ? "Sending…" : "Send Message"}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(sendContactEmail, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-gtp-dark-teal"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="How can we help?"
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-gtp-teal focus:outline-none focus:ring-1 focus:ring-gtp-teal"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm font-medium text-gtp-teal">
          Thank you! Your message has been sent.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
