"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CreateTaskButtonProps {
  onClick: () => void;
  /** Hides the label below `sm`, leaving an icon-only button in tight rows. */
  compactOnMobile?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Opens the create-task dialog.
 *
 * A thin wrapper rather than an inline Button so the primary action looks and
 * reads the same everywhere it appears — toolbar today, empty state later.
 */
export function CreateTaskButton({
  onClick,
  compactOnMobile = false,
  disabled = false,
  className,
}: CreateTaskButtonProps) {
  return (
    <Button
      type="button"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-10 shadow-lg shadow-brand/20 transition-all duration-300 hover:shadow-xl hover:shadow-brand/30",
        className,
      )}
    >
      <Plus aria-hidden="true" />
      {/* The accessible name stays "New task" at every size — when the visible
       * label is hidden the sr-only copy keeps the button announced. */}
      <span className={cn(compactOnMobile && "sr-only sm:not-sr-only")}>
        New task
      </span>
    </Button>
  );
}
