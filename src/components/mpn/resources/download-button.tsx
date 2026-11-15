"use client";

import { Download, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DownloadButton({ resourceId }: { resourceId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setStatus("loading");
    setError(null);

    const response = await fetch(`/api/mpn/resources/${resourceId}/download`);
    const payload = (await response.json()) as {
      data: { url: string } | null;
      error: { message?: string } | null;
    };

    if (!response.ok || !payload.data?.url) {
      setError(payload.error?.message ?? "Unable to prepare this download.");
      setStatus("error");
      return;
    }

    window.open(payload.data.url, "_blank", "noopener,noreferrer");
    setStatus("idle");
  }

  return (
    <div>
      <Button disabled={status === "loading"} onClick={download} type="button" variant="scph">
        {status === "loading" ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Download aria-hidden="true" />
        )}
        {status === "loading" ? "Preparing download…" : "Download resource"}
      </Button>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
