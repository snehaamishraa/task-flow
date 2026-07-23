"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskFilters,
  type TaskPriority,
  type TaskStatus,
} from "@/types/task";

/**
 * Sentinel for "no filter".
 *
 * The backend treats an absent/empty query param as "any", but an empty string
 * is indistinguishable from "nothing selected" in the Select, which would show
 * the placeholder instead of "All statuses". This maps to "" at the boundary.
 */
const ANY_VALUE = "__any__";

/**
 * Value→label maps for the Select roots.
 *
 * Base UI's `<Select.Value>` renders the raw value unless the root is given an
 * `items` map — without these the triggers read "__any__" instead of
 * "All statuses". The real status/priority values are their own labels, but
 * they must still be listed here or the map is treated as incomplete.
 */
const STATUS_ITEMS: Record<string, string> = {
  [ANY_VALUE]: "All statuses",
  ...Object.fromEntries(TASK_STATUSES.map((status) => [status, status])),
};

const PRIORITY_ITEMS: Record<string, string> = {
  [ANY_VALUE]: "All priorities",
  ...Object.fromEntries(TASK_PRIORITIES.map((priority) => [priority, priority])),
};

export interface FilterBarProps {
  filters: TaskFilters;
  onStatusChange: (value: TaskStatus | "") => void;
  onPriorityChange: (value: TaskPriority | "") => void;
  /** Clears both selects. Also clears the search term in the dashboard. */
  onClear?: () => void;
  className?: string;
}

/** Narrow the Select's unknown value back to our union. */
function toStatus(value: string): TaskStatus | "" {
  return value === ANY_VALUE ? "" : (value as TaskStatus);
}

function toPriority(value: string): TaskPriority | "" {
  return value === ANY_VALUE ? "" : (value as TaskPriority);
}

/**
 * Status and priority dropdowns for GET /api/tasks/filter.
 *
 * Presentational: it reports selections upward and holds no state of its own,
 * so the dashboard remains the single source of truth for the active query.
 */
export function FilterBar({
  filters,
  onStatusChange,
  onPriorityChange,
  onClear,
  className,
}: FilterBarProps) {
  const hasActiveFilter = filters.status !== "" || filters.priority !== "";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Select
        items={STATUS_ITEMS}
        value={filters.status === "" ? ANY_VALUE : filters.status}
        onValueChange={(value) => onStatusChange(toStatus(String(value)))}
      >
        <SelectTrigger
          className="h-10 w-full sm:w-[9.5rem]"
          aria-label="Filter by status"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY_VALUE}>All statuses</SelectItem>
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        items={PRIORITY_ITEMS}
        value={filters.priority === "" ? ANY_VALUE : filters.priority}
        onValueChange={(value) => onPriorityChange(toPriority(String(value)))}
      >
        <SelectTrigger
          className="h-10 w-full sm:w-[9.5rem]"
          aria-label="Filter by priority"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY_VALUE}>All priorities</SelectItem>
          {TASK_PRIORITIES.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Only rendered when there is something to clear, so the row does not
       * carry a permanently dead control. */}
      {hasActiveFilter && onClear ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-10 text-muted-foreground hover:text-foreground"
        >
          <X aria-hidden="true" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
