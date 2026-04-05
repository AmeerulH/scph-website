import type { ReactNode } from "react";
import { ScrollProgressSection } from "@/components/motion/ScrollProgressSection";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { cn } from "@/lib/utils";

export type SectionProseCtaProps = {
  title?: string;
  subtitle?: string;
  theme?: "scph" | "gtp";
  background?: "default" | "muted" | "dark";
  scrollProgress?: boolean;
  scrollReveal?: boolean;
  id?: string;
  className?: string;
  contentClassName?: string;
  constrainProse?: boolean;
  actionsInsideProse?: boolean;
  proseClassName?: string;
  actionsClassName?: string;
  prose: ReactNode;
  actions?: ReactNode;
};

function ProseCtaBody({
  constrainProse,
  actionsInsideProse,
  proseClassName,
  actionsClassName,
  prose,
  actions,
}: Pick<
  SectionProseCtaProps,
  | "constrainProse"
  | "actionsInsideProse"
  | "proseClassName"
  | "actionsClassName"
  | "prose"
  | "actions"
>) {
  if (!actions) {
    return constrainProse ? (
      <div className={cn("max-w-3xl", proseClassName)}>{prose}</div>
    ) : (
      prose
    );
  }

  if (actionsInsideProse && constrainProse) {
    return (
      <div className={cn("max-w-3xl", proseClassName)}>
        {prose}
        <div className={cn("mt-8 flex flex-wrap gap-4", actionsClassName)}>
          {actions}
        </div>
      </div>
    );
  }

  if (constrainProse) {
    return (
      <>
        <div className={cn("max-w-3xl", proseClassName)}>{prose}</div>
        <div className={cn("mt-10 flex flex-wrap gap-4", actionsClassName)}>
          {actions}
        </div>
      </>
    );
  }

  return (
    <>
      {prose}
      <div className={cn("flex flex-wrap gap-4", actionsClassName)}>{actions}</div>
    </>
  );
}

export function SectionProseCta({
  title,
  subtitle,
  theme = "scph",
  background = "default",
  scrollProgress = false,
  scrollReveal = true,
  id,
  className,
  contentClassName,
  constrainProse = true,
  actionsInsideProse = false,
  proseClassName,
  actionsClassName,
  prose,
  actions,
}: SectionProseCtaProps) {
  const section = (
    <SectionWrapper
      title={title}
      subtitle={subtitle}
      theme={theme}
      background={background}
      id={id}
      className={className}
      contentClassName={contentClassName}
      scrollReveal={scrollReveal}
    >
      <ProseCtaBody
        constrainProse={constrainProse}
        actionsInsideProse={actionsInsideProse}
        proseClassName={proseClassName}
        actionsClassName={actionsClassName}
        prose={prose}
        actions={actions}
      />
    </SectionWrapper>
  );

  if (scrollProgress) {
    return <ScrollProgressSection>{section}</ScrollProgressSection>;
  }

  return section;
}
