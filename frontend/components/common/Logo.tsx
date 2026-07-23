import Image from "next/image";
import Link from "next/link";

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
      <Image
        src="/logo.png"
        alt=""
        // Intrinsic size of the cropped file. next/image needs the real
        // dimensions to reserve space and avoid layout shift; the rendered
        // size comes from the classes below.
        width={628}
        height={468}
        // The mark sits above the fold in the navbar, so it should not wait
        // for lazy loading.
        priority
        className="h-8 w-auto transition-transform duration-300 ease-out group-hover:scale-105"
      />
      <span className="text-base font-semibold tracking-tight text-foreground">
        TaskFlow
      </span>
    </Link>
  );
}
