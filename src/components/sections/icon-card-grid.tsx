import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StaggerReveal } from "@/components/motion/StaggerReveal";
import { cn } from "@/lib/utils";

export type ScphWhiteLinkCardItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  linkLabel?: string;
};

export type ScphWhitePillarCardItem = {
  id: string;
  icon: LucideIcon;
  num: string;
  title: string;
  description: string;
};

export type ScphPriorityCardItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  titleClassName: string;
  iconBgClassName: string;
  iconClassName: string;
};

export type GtpGradientPillarCardItem = {
  id: string;
  icon: LucideIcon;
  num: string;
  title: string;
  body: string;
  bgClass: string;
  iconWrap: string;
  iconColour: string;
  bodyClass: string;
  numClass: string;
  titleClass: string;
};

type BaseIconCardGridProps = {
  staggerVariant?: "default" | "long";
  amount?: number;
  gridClassName: string;
  itemClassName?: string;
};

export type IconCardGridProps =
  | (BaseIconCardGridProps & {
      variant: "scph-white-link";
      items: ScphWhiteLinkCardItem[];
    })
  | (BaseIconCardGridProps & {
      variant: "scph-white-pillar";
      items: ScphWhitePillarCardItem[];
    })
  | (BaseIconCardGridProps & {
      variant: "scph-priority";
      items: ScphPriorityCardItem[];
      linkHref: string;
      linkLabel?: string;
    })
  | (BaseIconCardGridProps & {
      variant: "gtp-gradient-pillar";
      items: GtpGradientPillarCardItem[];
    });

export function IconCardGrid(
  props: BaseIconCardGridProps & {
    variant: "scph-white-link";
    items: ScphWhiteLinkCardItem[];
  },
): ReactNode;
export function IconCardGrid(
  props: BaseIconCardGridProps & {
    variant: "scph-white-pillar";
    items: ScphWhitePillarCardItem[];
  },
): ReactNode;
export function IconCardGrid(
  props: BaseIconCardGridProps & {
    variant: "scph-priority";
    items: ScphPriorityCardItem[];
    linkHref: string;
    linkLabel?: string;
  },
): ReactNode;
export function IconCardGrid(
  props: BaseIconCardGridProps & {
    variant: "gtp-gradient-pillar";
    items: GtpGradientPillarCardItem[];
  },
): ReactNode;
export function IconCardGrid(props: IconCardGridProps): ReactNode {
  const {
    variant,
    items,
    staggerVariant = "default",
    amount,
    gridClassName,
    itemClassName,
  } = props;

  let cards: ReactNode[];

  switch (variant) {
    case "scph-white-link":
      cards = items.map(
        ({ id, icon: Icon, title, description, href, linkLabel }) => (
          <div
            key={id}
            className="group flex min-h-[320px] flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-scph-blue/10">
              <Icon className="h-6 w-6 text-scph-blue" />
            </div>
            <h3 className="font-heading text-lg font-bold text-scph-blue">{title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
            <Link
              href={href}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
            >
              {linkLabel ?? "Learn More"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ),
      );
      break;

    case "scph-white-pillar":
      cards = items.map(({ id, icon: Icon, num, title, description }) => (
        <div
          key={id}
          className="flex min-h-[320px] flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-scph-blue/10">
              <Icon className="h-6 w-6 text-scph-blue" />
            </div>
            <span className="font-heading text-sm font-bold text-scph-dark-green/60">
              {num}
            </span>
          </div>
          <h3 className="font-heading text-lg font-bold leading-snug text-scph-blue">
            {title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
            {description}
          </p>
        </div>
      ));
      break;

    case "scph-priority": {
      const linkHref = props.linkHref;
      const linkLabel = props.linkLabel ?? "Learn More";
      cards = items.map(
        ({
          id,
          icon: Icon,
          title,
          description,
          titleClassName,
          iconBgClassName,
          iconClassName,
        }) => (
          <div
            key={id}
            className="group flex min-h-[320px] w-[85vw] max-w-[85vw] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
          >
            <div
              className={cn(
                "mb-5 flex h-14 w-14 items-center justify-center rounded-2xl",
                iconBgClassName,
              )}
            >
              <Icon className={cn("h-7 w-7", iconClassName)} />
            </div>
            <h3 className={cn("font-heading text-xl font-bold", titleClassName)}>
              {title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
              {description}
            </p>
            <Link
              href={linkHref}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
            >
              {linkLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ),
      );
      break;
    }

    case "gtp-gradient-pillar":
      cards = items.map(
        ({
          id,
          icon: Icon,
          num,
          title,
          body,
          bgClass,
          iconWrap,
          iconColour,
          bodyClass,
          numClass,
          titleClass,
        }) => (
          <div
            key={id}
            className={cn(
              "flex h-full min-h-[280px] w-full flex-col rounded-2xl p-6 text-white shadow-md ring-1 ring-white/15 transition-shadow duration-300 md:min-h-[320px] md:hover:shadow-xl",
              bgClass,
            )}
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  iconWrap,
                )}
              >
                <Icon className={cn("h-6 w-6", iconColour)} />
              </div>
              <span className={cn("font-heading text-sm font-bold", numClass)}>
                {num}
              </span>
            </div>
            <h3 className={cn("font-heading text-xl font-bold", titleClass)}>
              {title}
            </h3>
            <p className={cn("mt-3 flex-1 text-sm leading-relaxed", bodyClass)}>
              {body}
            </p>
          </div>
        ),
      );
      break;
  }

  return (
    <StaggerReveal
      className={gridClassName}
      variant={staggerVariant}
      amount={amount}
      itemClassName={itemClassName}
    >
      {cards}
    </StaggerReveal>
  );
}
