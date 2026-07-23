import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LinkButtonProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

/**
 * A navigation link that borrows the shadcn button styling.
 *
 * We style a real anchor instead of rendering `<Button render={<Link />} />`
 * because the Base UI button would add `type="button"` (or `role="button"`)
 * to the anchor, which misreports a link as a button to assistive tech.
 */
export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
