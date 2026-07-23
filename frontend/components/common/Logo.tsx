import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  /** Where the wordmark points. Defaults to the top of the landing page. */
  href?: string;
  className?: string;
}

export function Logo({ href = "#home", className }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="TaskFlow — back to top"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-soft shadow-lg shadow-brand/25 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-3"
      >
        <Check className="size-4 text-white" strokeWidth={3} />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">
        TaskFlow
      </span>
    </Link>
  );
}
