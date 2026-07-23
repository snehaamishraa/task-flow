"use client";

import type { ReactNode } from "react";
import { CircleAlert, Inbox, Plus, RefreshCw, SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { TaskCard, TaskCardSkeleton } from "@/components/dashboard/TaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

/** Placeholder count while loading — roughly two rows of the desktop grid. */
const SKELETON_COUNT = 6;

const GRID_CLASSES = "grid gap-4 sm:grid-cols-2 xl:grid-cols-3";

export interface TaskListProps {
  tasks: Task[];
  /** First load only — shows the skeleton grid. */
  isInitialLoading: boolean;
  /** Any request in flight, including search and filter refetches. */
  isFetching?: boolean;
  /** Message from the last failed load, or null. */
  error?: string | null;
  /** True when a search term or filter is narrowing the list. */
  hasActiveQuery?: boolean;
  /** Re-runs the current query. */
  onRetry?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  /** Opens the create dialog from the "no tasks yet" state. */
  onCreateTask?: () => void;
  /** Resets search and filters from the "no results" state. */
  onClearFilters?: () => void;
  /** Id of a task with a mutation in flight, so only that card dims. */
  busyTaskId?: number | null;
  className?: string;
}

/**
 * Renders the task collection and every non-happy path around it.
 *
 * Purely presentational: it makes no requests and owns no data. All state
 * arrives as props (shaped to match the useTasks return value) and all intent
 * leaves through callbacks, so the same list can be driven by a different
 * source without modification.
 */
export function TaskList({
  tasks,
  isInitialLoading,
  isFetching = false,
  error = null,
  hasActiveQuery = false,
  onRetry,
  onEdit,
  onDelete,
  onCreateTask,
  onClearFilters,
  busyTaskId = null,
  className,
}: TaskListProps) {
  const hasTasks = tasks.length > 0;

  // A failed load with nothing cached is the only case that replaces the list.
  // If stale tasks are on screen they stay, with the error shown above them —
  // blanking usable content on a transient failure helps nobody.
  if (error && !hasTasks && !isInitialLoading) {
    return (
      <div className={className}>
        <StateBlock
          icon={CircleAlert}
          tone="danger"
          title="Couldn't load your tasks"
          description={error}
          action={
            onRetry ? (
              <Button onClick={onRetry} size="lg" className="h-10">
                <RefreshCw aria-hidden="true" />
                Try again
              </Button>
            ) : null
          }
        />
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className={className}>
        <p className="sr-only" role="status">
          Loading tasks
        </p>
        <div className={GRID_CLASSES} aria-hidden="true">
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!hasTasks) {
    // The two empty states are genuinely different problems: one needs a first
    // task, the other needs the filters relaxed. Offering "Create task" to
    // someone whose search simply missed would be the wrong suggestion.
    return (
      <div className={className}>
        {hasActiveQuery ? (
          <StateBlock
            icon={SearchX}
            title="No matching tasks"
            description="No tasks match your current search and filters. Try a different term or clear the filters."
            action={
              onClearFilters ? (
                <Button
                  onClick={onClearFilters}
                  variant="outline"
                  size="lg"
                  className="h-10"
                >
                  Clear search and filters
                </Button>
              ) : null
            }
          />
        ) : (
          <StateBlock
            icon={Inbox}
            title="No tasks yet"
            description="Create your first task and it will show up here."
            action={
              onCreateTask ? (
                <Button onClick={onCreateTask} size="lg" className="h-10">
                  <Plus aria-hidden="true" />
                  Create task
                </Button>
              ) : null
            }
          />
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Stale-data case: keep the list, surface the failure above it. */}
      {error ? (
        <div
          role="alert"
          className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1">{error}</span>
          {onRetry ? (
            <Button onClick={onRetry} variant="outline" size="sm">
              <RefreshCw aria-hidden="true" />
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Announced after the list settles so a search result count is heard
          without narrating every keystroke. */}
      <p className="sr-only" role="status" aria-live="polite">
        {isFetching
          ? "Updating tasks"
          : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
      </p>

      <ul
        aria-busy={isFetching}
        className={cn(
          GRID_CLASSES,
          // Dim during a refetch so the list reads as provisional without the
          // content disappearing and reflowing the page.
          isFetching && "opacity-60 transition-opacity duration-200",
        )}
      >
        {tasks.map((task) => (
          <li key={task.id} className="flex">
            <TaskCard
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              isBusy={busyTaskId === task.id}
              className="w-full"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface StateBlockProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "default" | "danger";
}

/** Shared frame for the empty and error states, so all three look alike. */
function StateBlock({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
}: StateBlockProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/30 px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-12 items-center justify-center rounded-2xl border",
          tone === "danger"
            ? "border-destructive/25 bg-destructive/10 text-destructive"
            : "border-brand/20 bg-brand/10 text-brand",
        )}
      >
        <Icon className="size-6" />
      </span>

      <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-pretty text-muted-foreground">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
