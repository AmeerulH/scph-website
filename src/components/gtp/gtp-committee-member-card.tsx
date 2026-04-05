import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type GtpCommitteeMember = {
  name: string;
  role: string;
  organisation?: string;
  isPlaceholder?: boolean;
  photoSrc?: string;
  imageObjectClass?: string;
};

export function GtpCommitteeMemberCard({ member }: { member: GtpCommitteeMember }) {
  if (member.isPlaceholder) {
    return (
      <div className="flex flex-col rounded-2xl border border-dashed border-gtp-teal/20 bg-gtp-dark-teal/3 p-6">
        <p className="font-heading text-sm font-semibold text-gtp-dark-teal/40">
          {member.role}
        </p>
        <p className="mt-1 text-xs text-gray-400">To be announced</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gtp-dark-teal/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gtp-dark-teal/10">
        {member.photoSrc ? (
          <Image
            src={member.photoSrc}
            alt={member.name}
            fill
            className={cn(
              "object-cover",
              member.imageObjectClass ?? "object-top",
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
        ) : (
          <div className="flex h-full min-h-[9rem] items-center justify-center">
            <UserCircle2 className="h-16 w-16 text-gtp-teal/25 sm:h-20 sm:w-20" />
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-heading text-base font-bold text-gtp-dark-teal">
          {member.name}
        </p>
        <p className="mt-1 text-sm font-semibold italic text-gtp-teal">
          {member.role}
        </p>
        {member.organisation && (
          <p className="mt-1 text-xs text-gray-500">{member.organisation}</p>
        )}
      </div>
    </div>
  );
}
