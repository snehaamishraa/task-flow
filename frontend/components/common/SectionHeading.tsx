import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small label above the title. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Ties the heading to its section via `aria-labelledby`. */
  titleId?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  titleId,
  align = "center",
  className,
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col",
        isCentered ? "mx-auto items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-medium tracking-wide text-brand uppercase">
          {eyebrow}
        </span>
      ) : null}

      <h2
        id={titleId}
        className={cn(
          "text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl",
          eyebrow && "mt-5",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
