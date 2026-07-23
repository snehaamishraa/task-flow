import { CircleCheckBig, CircleDashed, CircleDotDashed } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isTaskStatus, type TaskStatus } from "@/types/task";

interface StatusStyle {
  icon: LucideIcon;
  /** Colour pair applied on top of the outline variant. */
  className: string;
}

/**
 * Keyed by the exact strings the backend stores — "Pending", "In Progress",
 * and "Completed" (see backend/repositories/task_repository.go, which counts
 * these values verbatim). Changing a key here silently breaks the mapping.
 */
const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  Pending: {
    icon: CircleDashed,
    className: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  },
  "In Progress": {
    icon: CircleDotDashed,
    className: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  },
  Completed: {
    icon: CircleCheckBig,
    className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  },
};

/** Fallback for any value the backend returns that we don't recognize. */
const UNKNOWN_STYLE: StatusStyle = {
  icon: CircleDashed,
  className: "border-border bg-muted/40 text-muted-foreground",
};

interface StatusBadgeProps {
  /** Widened to string because the column is free-form text, not an enum. */
  status: TaskStatus | string;
  className?: string;
}

/**
 * Renders a task's status.
 *
 * The icon carries the same distinction as the colour, so the state is still
 * legible without colour vision. The label is always the real value — an
 * unrecognized status is shown as-is rather than hidden behind "Unknown".
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = isTaskStatus(status) ? STATUS_STYLES[status] : UNKNOWN_STYLE;
  const Icon = style.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 transition-colors duration-200",
        style.className,
        className,
      )}
    >
      <Icon aria-hidden="true" />
      {status}
    </Badge>
  );
}
