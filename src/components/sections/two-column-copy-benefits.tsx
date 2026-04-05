import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TwoColumnCopyBenefitsProps = {
  copy: {
    eyebrow: string;
    title: string;
    titleClassName?: string;
    children: ReactNode;
  };
  benefits: {
    eyebrow: string;
    title: string;
    titleClassName?: string;
    items: string[];
  };
};

function EyebrowRow({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
      <span className="h-px w-8 shrink-0 bg-current opacity-60" />
      <span className="text-xs font-semibold uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
}

export function TwoColumnCopyBenefits({ copy, benefits }: TwoColumnCopyBenefitsProps) {
  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      <div>
        <EyebrowRow label={copy.eyebrow} />
        <h2
          className={cn(
            "font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl",
            copy.titleClassName,
          )}
        >
          {copy.title}
        </h2>
        <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
        {copy.children}
      </div>

      <div>
        <EyebrowRow label={benefits.eyebrow} />
        <h2
          className={cn(
            "font-heading text-3xl font-bold leading-tight text-scph-blue",
            benefits.titleClassName,
          )}
        >
          {benefits.title}
        </h2>
        <ul className="mt-6 space-y-4">
          {benefits.items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-scph-green/15">
                <CheckCircle2 className="h-4 w-4 text-scph-dark-green" />
              </div>
              <p className="text-base leading-relaxed text-gray-600">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
