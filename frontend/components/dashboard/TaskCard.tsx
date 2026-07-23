"use client";

import {
  CalendarDays,
  CircleAlert,
  EllipsisVertical,
  SquarePen,
  Trash2,
} from "lucide-react";

import { PriorityBadge } from "@/components/dashboard/PriorityBadge";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

/**
 * Formatted in UTC on purpose.
 *
 * Due dates are stored as UTC midnight (see toApiDate in the task service).
 * Formatting them in the viewer's local zone would render the previous
 * calendar day for anyone behind UTC — the same off-by-one the service avoids
 * on the way in.
 */
const DUE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Render a due date, or null when unset or unparseable. */
function formatDueDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return DUE_DATE_FORMATTER.format(parsed);
}

/**
 * Whether a due date has passed.
 *
 * Compared as whole UTC days so a task due today never reads as overdue, and
 * skipped for completed tasks — a finished task is not late.
 */
function isOverdue(value: string | null, status: string): boolean {
  if (!value || status === "Completed") return false;
  const due = new Date(value);
  if (Number.isNaN(due.getTime())) return false;

  const now = new Date();
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return due.getTime() < todayUtc;
}

export interface TaskCardProps {
  task: Task;
  /** Opens the edit dialog. Omit to hide the action. */
  onEdit?: (task: Task) => void;
  /** Opens the delete confirmation. Omit to hide the action. */
  onDelete?: (task: Task) => void;
  /** Disables the action menu while a mutation for this task is in flight. */
  isBusy?: boolean;
  className?: string;
}

/**
 * A single task.
 *
 * Purely presentational: it raises intent through onEdit/onDelete and never
 * calls the API itself, so the same card works in a list, a search result, or
 * a future board column without change.
 */
export function TaskCard({
  task,
  onEdit,
  onDelete,
  isBusy = false,
  className,
}: TaskCardProps) {
  const dueDate = formatDueDate(task.due_date);
  const overdue = isOverdue(task.due_date, task.status);
  const hasActions = Boolean(onEdit || onDelete);
  const titleId = `task-${task.id}-title`;

  return (
    <Card
      aria-labelledby={titleId}
      className={cn(
        "group h-full gap-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:ring-brand/30 hover:shadow-lg hover:shadow-brand/5",
        isBusy && "pointer-events-none opacity-60",
        className,
      )}
    >
      <CardHeader>
        <CardTitle>
          {/* h3: the page provides h1, and each dashboard section an h2. */}
          <h3
            id={titleId}
            className="line-clamp-2 text-sm leading-snug font-semibold text-balance"
          >
            {task.title}
          </h3>
        </CardTitle>

        {task.description ? (
          <CardDescription className="line-clamp-2 text-sm leading-relaxed">
            {task.description}
          </CardDescription>
        ) : null}

        {hasActions ? (
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={isBusy}
                aria-label={`Actions for ${task.title}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon-sm" }),
                  // Always visible on touch, where there is no hover to reveal it.
                  "text-muted-foreground opacity-100 transition-opacity hover:text-foreground focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100",
                )}
              >
                <EllipsisVertical aria-hidden="true" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                {onEdit ? (
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <SquarePen aria-hidden="true" />
                    Edit
                  </DropdownMenuItem>
                ) : null}

                {onEdit && onDelete ? <DropdownMenuSeparator /> : null}

                {onDelete ? (
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDelete(task)}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        ) : null}
      </CardHeader>

      <CardContent className="mt-auto flex flex-wrap items-center gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />

        {dueDate ? (
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 text-xs whitespace-nowrap",
              overdue ? "font-medium text-rose-300" : "text-muted-foreground",
            )}
          >
            {overdue ? (
              <CircleAlert className="size-3.5" aria-hidden="true" />
            ) : (
              <CalendarDays className="size-3.5" aria-hidden="true" />
            )}
            {/* "Overdue" is spelled out so the state does not rely on colour. */}
            <span className="sr-only">{overdue ? "Overdue, due " : "Due "}</span>
            {dueDate}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}

/**
 * Placeholder matching TaskCard's dimensions.
 *
 * Kept beside the real card so the two stay in step: if the card grows a row,
 * this is the file you are already editing.
 */
export function TaskCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("h-full gap-4", className)} aria-hidden="true">
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-2/3" />
      </CardHeader>
      <CardContent className="mt-auto flex items-center gap-2">
        <Skeleton className="h-5 w-24 rounded-4xl" />
        <Skeleton className="h-5 w-20 rounded-4xl" />
        <Skeleton className="ml-auto h-3 w-20" />
      </CardContent>
    </Card>
  );
}
