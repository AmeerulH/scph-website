import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StaggerReveal } from "@/components/motion/StaggerReveal";

export type ArticleCardItem = {
  title: string;
  tag: string;
  excerpt: string;
};

export type ArticleCardGridProps = {
  items: ArticleCardItem[];
  articleHref: string;
  readLabel?: string;
};

export function ArticleCardGrid({
  items,
  articleHref,
  readLabel = "Read Article",
}: ArticleCardGridProps) {
  return (
    <StaggerReveal
      className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 py-4 pb-2 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:py-0 md:pb-0 lg:grid-cols-3"
      variant="long"
    >
      {items.map(({ title, tag, excerpt }) => (
        <div
          key={title}
          className="group flex min-h-[320px] w-[85vw] max-w-[85vw] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:w-auto md:max-w-none"
        >
          <Badge variant="scph" className="mb-4 w-fit">
            {tag}
          </Badge>
          <h3 className="line-clamp-3 font-heading text-base font-bold leading-snug text-scph-blue">
            {title}
          </h3>
          <p className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-gray-500">
            {excerpt}
          </p>
          <a
            href={articleHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
          >
            {readLabel} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      ))}
    </StaggerReveal>
  );
}
