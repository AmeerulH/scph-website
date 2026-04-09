"use client";

import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgrammeSpeakerAvatarProps = {
  imageUrl?: string;
  /** Used for image alt text when a photo is shown */
  name?: string;
  /** Tailwind size classes, e.g. h-8 w-8 or h-9 w-9 */
  sizeClassName?: string;
};

export function ProgrammeSpeakerAvatar({
  imageUrl,
  name,
  sizeClassName = "h-9 w-9",
}: ProgrammeSpeakerAvatarProps) {
  const isSmall = sizeClassName.includes("h-8");
  const px = isSmall ? 64 : 72;

  if (imageUrl?.trim()) {
    return (
      <Image
        src={imageUrl.trim()}
        alt={name?.trim() ? `Photo of ${name.trim()}` : ""}
        width={px}
        height={px}
        className={cn("shrink-0 rounded-full object-cover", sizeClassName)}
      />
    );
  }

  return <UserCircle2 className={cn("shrink-0 text-gray-300", sizeClassName)} />;
}
