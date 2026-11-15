"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { ArrowRight, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { safeRegistrationUrl, type ActivityRegistrationState } from "@/lib/gtp-activity-registration";

type VerificationState =
  | {status: "idle"; error?: string}
  | {status: "loading"}
  | {status: "verified"; formUrl: string | null};

const PENDING: ActivityRegistrationState = {status: "comingSoon", label: "Registration opening soon"};
const CTA_CLASS = "bg-gtp-orange-dark hover:bg-gtp-dark-teal";

export function ActionWorkshopRegistration({
  redirectToWorkshops = false,
  workshopTitle,
  dateLabel,
  registration = PENDING,
  verificationEndpoint = "/api/gtp/action-workshops/verify",
}: {
  redirectToWorkshops?: boolean;
  workshopTitle?: string;
  dateLabel?: string;
  registration?: ActivityRegistrationState;
  verificationEndpoint?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<VerificationState>({status: "idle"});
  const requestRef = React.useRef<AbortController | null>(null);
  const emailId = React.useId();

  React.useEffect(() => () => requestRef.current?.abort(), []);

  function changeOpen(next: boolean) {
    requestRef.current?.abort();
    requestRef.current = null;
    setOpen(next);
    setEmail("");
    setState({status: "idle"});
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestRef.current) return;
    const request = new AbortController();
    requestRef.current = request;
    setState({status: "loading"});
    try {
      const response = await fetch(verificationEndpoint, {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email}), signal: request.signal,
      });
      const body = await response.json() as {ok?: boolean; error?: string; formUrl?: string | null};
      if (request.signal.aborted) return;
      if (!response.ok || body.ok !== true) {
        setState({status: "idle", error: body.error || "We could not verify your registration. Please try again."});
      } else {
        setState({status: "verified", formUrl: safeRegistrationUrl(body.formUrl || undefined)});
      }
    } catch {
      if (!request.signal.aborted) setState({status: "idle", error: "We could not verify your registration. Please try again."});
    } finally {
      if (requestRef.current === request) requestRef.current = null;
    }
  }

  if (redirectToWorkshops) {
    const href = workshopTitle
      ? `/events/gtp-2026/programmes/action-workshops?workshop=${encodeURIComponent(workshopTitle)}#action-workshops`
      : "/events/gtp-2026/programmes/action-workshops#action-workshops";
    return <Button variant="gtpCta" className={CTA_CLASS} asChild><a href={href}>View sessions and registration<ArrowRight aria-hidden /></a></Button>;
  }

  if (registration.status !== "open") {
    return <div className="flex flex-col items-start gap-2">
      <Button variant="gtpCta" className={CTA_CLASS} type="button" disabled>{registration.status === "closed" ? "Registration closed" : "Register here"}<ArrowRight aria-hidden /></Button>
      {registration.status !== "closed" ? <p className="text-xs text-gtp-dark-teal/80">{registration.label}</p> : null}
    </div>;
  }

  return <Dialog.Root open={open} onOpenChange={changeOpen}>
    <Dialog.Trigger asChild><Button variant="gtpCta" className={CTA_CLASS} type="button">{registration.label}<ArrowRight aria-hidden /></Button></Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-70 bg-gtp-dark-teal/70" />
      <Dialog.Content
        className="fixed left-1/2 top-1/2 z-70 max-h-[90dvh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 shadow-xl focus:outline-none sm:p-8"
        onEscapeKeyDown={(event) => {event.preventDefault(); changeOpen(false);}}
      >
        <Dialog.Close className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-gtp-dark-teal transition-colors hover:bg-gtp-dark-teal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gtp-teal" aria-label="Close registration verification"><X className="size-5" aria-hidden /></Dialog.Close>
        <Dialog.Title className="pr-7 font-heading text-2xl font-bold text-gtp-dark-teal">{state.status === "verified" ? "You’re eligible to register" : "Verify your registration"}</Dialog.Title>
        <Dialog.Description className="mt-3 text-sm leading-relaxed text-gtp-dark-teal/85">
          {state.status === "verified" ? "Continue to the shared Action Workshops and Research Sessions registration form." : "Enter the email address you used to register for GTP 2026 before continuing to the shared workshop and research form."}
        </Dialog.Description>
        {dateLabel ? <p className="mt-3 text-sm font-semibold text-gtp-dark-teal">{dateLabel}</p> : null}
        {state.status === "verified" ? <div className="mt-6" role="status">
          <CheckCircle2 className="size-9 text-gtp-dark-green" aria-hidden />
          {state.formUrl ? <Button variant="gtpCta" className={cn("mt-5 w-full", CTA_CLASS)} asChild><a href={state.formUrl} target="_blank" rel="noopener noreferrer">Continue to registration form<ArrowRight aria-hidden /></a></Button>
            : <p className="mt-3 text-sm leading-relaxed text-gtp-dark-teal/85">The shared registration form is not available yet. Please check back soon.</p>}
        </div> : <form className="mt-6" onSubmit={verify}>
          <label className="block text-sm font-semibold text-gtp-dark-teal" htmlFor={emailId}>Registration email</label>
          <input id={emailId} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} disabled={state.status === "loading"}
            className="mt-2 h-11 w-full rounded-lg border border-gtp-dark-teal/30 px-3 text-gtp-dark-teal caret-gtp-teal outline-none placeholder:text-gtp-dark-teal/70 focus:border-gtp-teal focus:ring-2 focus:ring-gtp-teal/25 disabled:opacity-60" placeholder="you@example.com" />
          {state.status === "idle" && state.error ? <p className="mt-3 text-sm text-red-700" role="alert">{state.error}</p> : null}
          <Button variant="gtpCta" type="submit" className={cn("mt-5 w-full", CTA_CLASS)} disabled={state.status === "loading"}>
            {state.status === "loading" ? <><LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden /><span role="status">Checking registration</span></> : "Continue"}
          </Button>
        </form>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
