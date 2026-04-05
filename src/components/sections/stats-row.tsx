import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";

export type StatsRowItem = {
  value: string;
  label: string;
};

export type StatsRowProps = {
  items: StatsRowItem[];
  variant: "blue-band" | "light-green";
};

export function StatsRow({ items, variant }: StatsRowProps) {
  const isBlueBand = variant === "blue-band";

  const grid = (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {items.map((stat, i) => (
        <div key={stat.label} className="relative text-center">
          {i > 0 && (
            <span
              className={cn(
                "absolute -left-4 top-1/2 hidden h-10 w-px -translate-y-1/2 md:block",
                isBlueBand ? "bg-white/15" : "bg-scph-blue/15",
              )}
            />
          )}
          <p
            className={cn(
              "font-heading text-4xl font-bold",
              isBlueBand ? "text-scph-green" : "text-scph-blue",
            )}
          >
            {stat.value}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              isBlueBand ? "text-white/70" : "text-gray-500",
            )}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );

  if (isBlueBand) {
    return (
      <div className="bg-scph-blue py-12">
        <ScrollReveal className="mx-auto max-w-7xl px-6 lg:px-8">
          {grid}
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="bg-scph-green/10 py-12 px-4">
      <div className="mx-auto max-w-7xl">{grid}</div>
    </div>
  );
}
