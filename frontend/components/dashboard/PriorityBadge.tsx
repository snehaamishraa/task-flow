import { SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { isTaskPriority, type TaskPriority } from "@/types/task";

interface PriorityStyle {
  icon: LucideIcon;
  /** Colour pair applied on top of the outline variant. */
  className: string;
}

/**
 * Keyed by the exact strings the backend stores — "Low", "Medium", "High".
 * The Task column defaults to "Medium" (backend/models/task.go).
 *
 * The signal-strength icons encode magnitude by shape, so priority stays
 * rankable at a glance without depending on the colour.
 */
const PRIORITY_STYLES: Record<TaskPriority, PriorityStyle> = {
  Low: {
    icon: SignalLow,
    className: "border-border bg-muted/40 text-muted-foreground",
  },
  Medium: {
    icon: SignalMedium,
    className: "border-brand/25 bg-brand/10 text-brand",
  },
  High: {
    icon: SignalHigh,
    className: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  },
};

/** Fallback for any value the backend returns that we don't recognize. */
const UNKNOWN_STYLE: PriorityStyle = {
  icon: SignalLow,
  className: "border-border bg-muted/40 text-muted-foreground",
};

interface PriorityBadgeProps {
  /** Widened to string because the column is free-form text, not an enum. */
  priority: TaskPriority | string;
  className?: string;
}

/**
 * Renders a task's priority.
 *
 * "Priority:" is announced to screen readers because "High" on its own is
 * ambiguous when it sits next to a status badge in a table row.
 */
export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const style = isTaskPriority(priority)
    ? PRIORITY_STYLES[priority]
    : UNKNOWN_STYLE;
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
      <span className="sr-only">Priority: </span>
      {priority}
    </Badge>
  );
}
