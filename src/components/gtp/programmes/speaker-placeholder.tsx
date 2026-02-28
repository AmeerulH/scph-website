import { UserCircle2 } from "lucide-react";

export function SpeakerPlaceholder() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
      <UserCircle2 className="h-8 w-8 shrink-0 text-gray-300" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-300">Speaker Name</p>
        <p className="text-xs text-gray-300">Designation</p>
      </div>
    </div>
  );
}
