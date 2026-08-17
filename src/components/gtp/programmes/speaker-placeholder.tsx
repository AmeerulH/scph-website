import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpeakerPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-dashed px-4 py-3",
        className ?? "border-gray-200 bg-gray-50",
      )}
    >
      <UserCircle2 className="h-8 w-8 shrink-0 text-gray-300" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-500">To be confirmed</p>
        <p className="text-xs text-gray-400">Speaker details coming soon</p>
      </div>
    </div>
  );
}
