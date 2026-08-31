"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const next = searchParams.get("next");

    const response = await fetch("/api/mpn/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        next,
      }),
    });

    const payload = (await response.json()) as {
      data: { redirectTo: string } | null;
      error: { message: string } | null;
    };

    if (!response.ok || !payload.data?.redirectTo) {
      setError(payload.error?.message ?? "Unable to sign in.");
      setIsSubmitting(false);
      return;
    }

    window.location.replace(payload.data.redirectTo);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700">
        Email address
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="email" type="email" autoComplete="email" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" name="password" type="password" autoComplete="current-password" required />
      </label>
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      <Button className="w-full" type="submit" variant="scph" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
