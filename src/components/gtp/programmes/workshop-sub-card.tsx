import type { Workshop } from "./types";
import { SpeakerPlaceholder } from "./speaker-placeholder";

export function WorkshopSubCard({ w }: { w: Workshop }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gtp-teal/15 text-xs font-bold text-gtp-dark-teal">
          {w.number}
        </span>
        <p className="text-sm font-medium leading-snug text-gray-700">
          {w.title}
        </p>
      </div>
      <div className="mt-3 pl-9">
        <SpeakerPlaceholder />
      </div>
    </div>
  );
}
