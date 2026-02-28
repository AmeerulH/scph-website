import { CalendarDays } from "lucide-react";

export function PreConferencePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gtp-teal/30 bg-white px-8 py-20 text-center shadow-sm">
      <CalendarDays className="h-16 w-16 text-gtp-teal/40" />
      <h3 className="mt-6 font-heading text-2xl font-bold text-gtp-dark-teal">
        Pre-Conference Programme
      </h3>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-400">
        More details coming soon. Check back for updates on pre-conference
        workshops, site visits, and networking events.
      </p>
    </div>
  );
}
