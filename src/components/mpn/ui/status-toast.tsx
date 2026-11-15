"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StatusToast({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(false), 6_000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-xl border border-scph-green/40 bg-white px-4 py-3 shadow-lg" role="status">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-scph-green" aria-hidden="true" />
      <p className="flex-1 text-sm leading-6 text-slate-700">{message}</p>
      <Button aria-label="Dismiss notification" className="-mr-2 -mt-1" onClick={() => setIsVisible(false)} size="icon-xs" variant="ghost">
        <X aria-hidden="true" />
      </Button>
    </div>
  );
}
