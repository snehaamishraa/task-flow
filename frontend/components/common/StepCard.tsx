import { Check } from "lucide-react";

import type { Step } from "@/types/landing";
import { cn } from "@/lib/utils";

interface StepCardProps {
  step: Step;
  /** Zero-based position, rendered as a padded step number. */
  index: number;
  className?: string;
}

export function StepCard({ step, index, className }: StepCardProps) {
  const { icon: Icon, title, description, highlights } = step;
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <li className={cn("group relative flex flex-col items-center", className)}>
      {/* Number badge sits on the timeline rule at large breakpoints. */}
      <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-brand/30 bg-background font-mono text-sm font-semibold text-brand shadow-lg shadow-brand/10 transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-brand/60 group-hover:shadow-brand/25">
        <span aria-hidden="true">{stepNumber}</span>
        <span className="sr-only">Step {index + 1}</span>
      </span>

      <div className="mt-6 w-full rounded-2xl border border-border/60 bg-card/40 p-6 text-center transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-brand/40 group-hover:bg-card group-hover:shadow-xl group-hover:shadow-brand/10 sm:p-7">
        <span className="inline-flex size-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand transition-transform duration-300 ease-out group-hover:scale-110">
          <Icon className="size-5" aria-hidden="true" />
        </span>

        <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <ul className="mt-5 space-y-2 border-t border-border/60 pt-5 text-left">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-start gap-2 text-xs text-muted-foreground"
            >
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-brand"
                aria-hidden="true"
              />
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
