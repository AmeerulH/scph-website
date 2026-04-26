"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FullPageLoadingOverlay } from "@/components/navigation/full-page-loading-overlay";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function JournalistWorkshopsUnlockForm({ className }: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [navigating, setNavigating] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Please enter your access code.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/scph/journalist-workshops/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
        credentials: "include",
      });
      if (res.ok) {
        setCode("");
        setNavigating(true);
        router.refresh();
        return;
      }
      if (res.status === 429) {
        setError("Too many attempts. Please wait a few minutes and try again.");
        return;
      }
      setError("That code was not recognised. Check for typos and try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
    {navigating && <FullPageLoadingOverlay variant="scph" label="Unlocking workshop materials" />}
    <form
      onSubmit={onSubmit}
      className={cn("space-y-4", className)}
      autoComplete="off"
    >
      <div>
        <label htmlFor="jw-access-code" className="sr-only">
          Access code
        </label>
        <input
          id="jw-access-code"
          name="access-code"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={code}
          onChange={(ev) => setCode(ev.target.value)}
          placeholder="Enter your access code"
          disabled={pending}
          className="w-full rounded-lg border border-scph-blue/20 bg-white px-4 py-3 text-base text-foreground shadow-sm outline-none transition focus:border-scph-blue focus:ring-2 focus:ring-scph-blue/20 disabled:opacity-60"
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="scph" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Checking…" : "Unlock materials"}
      </Button>
    </form>
    </>
  );
}
