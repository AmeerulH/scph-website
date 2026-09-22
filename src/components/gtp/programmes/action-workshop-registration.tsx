"use client";

import * as React from "react";
import { CheckCircle2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type VerificationState =
  | { status: "idle"; error?: string }
  | { status: "loading" }
  | { status: "verified"; formUrl: string | null };

const ACTION_WORKSHOP_REGISTRATION_AVAILABLE = false;

export function ActionWorkshopRegistration({
  redirectToWorkshops = false,
  workshopTitle,
}: {
  redirectToWorkshops?: boolean;
  workshopTitle?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<VerificationState>({ status: "idle" });

  if (redirectToWorkshops) {
    const href = workshopTitle
      ? `/events/gtp-2026/programmes/action-workshops?workshop=${encodeURIComponent(workshopTitle)}#action-workshops`
      : "/events/gtp-2026/programmes/action-workshops#action-workshops";

    return (
      <Button variant="gtpCta" asChild>
        <a href={href}>Register now</a>
      </Button>
    );
  }

  if (!ACTION_WORKSHOP_REGISTRATION_AVAILABLE) {
    return (
      <div>
        <Button variant="gtpCta" type="button" disabled>
          Register now
        </Button>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Action Workshop registration will be available soon.
        </p>
      </div>
    );
  }

  function close() {
    setOpen(false);
    setEmail("");
    setState({ status: "idle" });
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "loading" });

    try {
      const response = await fetch("/api/gtp/action-workshops/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await response.json()) as {
        ok?: boolean;
        error?: string;
        formUrl?: string | null;
      };

      if (!response.ok || body.ok !== true) {
        setState({ status: "idle", error: body.error || "We could not verify your registration." });
        return;
      }

      setState({ status: "verified", formUrl: body.formUrl || null });
    } catch {
      setState({ status: "idle", error: "We could not verify your registration. Please try again." });
    }
  }

  return (
    <>
      <Button variant="gtpCta" type="button" onClick={() => setOpen(true)}>
        Register now
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gtp-dark-teal/70 p-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-workshop-registration-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close registration verification"
            >
              <X className="size-5" />
            </button>

            {state.status === "verified" ? (
              <div>
                <CheckCircle2 className="size-10 text-gtp-green" aria-hidden />
                <h2
                  id="action-workshop-registration-title"
                  className="mt-4 font-heading text-2xl font-bold text-gtp-dark-teal"
                >
                  You&apos;re verified
                </h2>
                {state.formUrl ? (
                  <>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      You can now continue to select your Action Workshop.
                    </p>
                    <Button variant="gtpCta" className="mt-6 w-full" asChild>
                      <a href={state.formUrl} target="_blank" rel="noopener noreferrer">
                        Continue to registration form
                      </a>
                    </Button>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    You&apos;re eligible to register. The workshop registration form will be
                    available here shortly.
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={verify}>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-gtp-teal">
                  Action Workshops
                </p>
                <h2
                  id="action-workshop-registration-title"
                  className="mt-3 font-heading text-2xl font-bold text-gtp-dark-teal"
                >
                  Verify your registration
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Enter the email address you used to register for GTP 2026.
                </p>
                <label className="mt-6 block text-sm font-semibold text-gtp-dark-teal" htmlFor="workshop-email">
                  Registration email
                </label>
                <input
                  id="workshop-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 px-3 text-slate-900 outline-none transition focus:border-gtp-teal focus:ring-2 focus:ring-gtp-teal/25"
                  placeholder="you@example.com"
                />
                {state.status === "idle" && state.error ? (
                  <p className="mt-3 text-sm text-red-700" role="alert">
                    {state.error}
                  </p>
                ) : null}
                <Button
                  variant="gtpCta"
                  type="submit"
                  className="mt-6 w-full"
                  disabled={state.status === "loading"}
                >
                  {state.status === "loading" ? (
                    <>
                      <LoaderCircle className="animate-spin" /> Checking registration
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
