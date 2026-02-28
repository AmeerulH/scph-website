import { cn } from "@/lib/utils";
import { Construction } from "lucide-react";

type Theme = "scph" | "gtp";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  theme?: Theme;
}

const themeStyles: Record<
  Theme,
  {
    heading: string;
    accent: string;
    icon: string;
    badge: string;
    border: string;
  }
> = {
  scph: {
    heading: "text-scph-blue",
    accent: "bg-scph-green",
    icon: "text-scph-green",
    badge: "bg-scph-blue/10 text-scph-blue",
    border: "border-scph-green/30",
  },
  gtp: {
    heading: "text-gtp-dark-teal",
    accent: "bg-gtp-teal",
    icon: "text-gtp-teal",
    badge: "bg-gtp-dark-teal/10 text-gtp-dark-teal",
    border: "border-gtp-teal/30",
  },
};

export function PlaceholderPage({
  title,
  description = "This section is currently being developed. Check back soon.",
  theme = "scph",
}: PlaceholderPageProps) {
  const styles = themeStyles[theme];

  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 text-center">
      <div
        className={cn(
          "mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2",
          styles.border
        )}
      >
        <Construction className={cn("h-9 w-9", styles.icon)} />
      </div>

      <span
        className={cn(
          "mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          styles.badge
        )}
      >
        Coming Soon
      </span>

      <h1
        className={cn(
          "font-heading text-4xl font-bold md:text-5xl",
          styles.heading
        )}
      >
        {title}
      </h1>

      <div className={cn("mx-auto mt-4 h-1 w-16 rounded-full", styles.accent)} />

      <p className="mt-6 max-w-md text-base text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
