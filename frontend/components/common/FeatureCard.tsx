import type { Feature } from "@/types/landing";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const { icon: Icon, title, description } = feature;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand/40 hover:bg-card hover:shadow-xl hover:shadow-brand/10",
        className,
      )}
    >
      {/* Hover wash — decorative only. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative">
        <span className="inline-flex size-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-brand/40 group-hover:bg-brand/15">
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </article>
  );
}
