import {
  CircleCheckBig,
  CircleDashed,
  CircleDotDashed,
  ListTodo,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types/task";

interface StatDefinition {
  /** Key on the stats payload from GET /api/tasks/stats. */
  key: keyof DashboardStats;
  label: string;
  icon: LucideIcon;
  /** Icon chip colours. Matched to StatusBadge so a count and a badge agree. */
  accent: string;
}

/**
 * The four counts the backend returns, in reading order.
 *
 * Keys mirror GetDashboardStats in backend/repositories/task_repository.go
 * exactly — note `in_progress` is snake_case while the others are single words.
 */
const STATS: StatDefinition[] = [
  {
    key: "total",
    label: "Total tasks",
    icon: ListTodo,
    accent: "border-brand/20 bg-brand/10 text-brand",
  },
  {
    key: "pending",
    label: "Pending",
    icon: CircleDashed,
    accent: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: CircleDotDashed,
    accent: "border-sky-400/20 bg-sky-400/10 text-sky-300",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CircleCheckBig,
    accent: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  },
];

/** Shared type scale for the figure, so "—" and a real count align identically. */
const FIGURE_CLASSES =
  "font-mono text-3xl leading-none font-semibold tracking-tight tabular-nums";

interface StatsCardsProps {
  /** Null while the first request is still in flight. */
  stats: DashboardStats | null;
  /** Renders skeletons instead of figures. */
  isLoading?: boolean;
  className?: string;
}

/**
 * Four summary counts for the dashboard header.
 *
 * Rendered as a description list so each number is announced with its label
 * rather than as a bare figure. Skeletons keep the same box dimensions as the
 * loaded state, so nothing shifts when the data lands.
 */
export function StatsCards({ stats, isLoading = false, className }: StatsCardsProps) {
  // Three distinct cases, not two. A failed load leaves `stats` null with
  // `isLoading` already false — pulsing skeletons there would claim work is
  // still in progress while the list below shows a hard error. Those cards
  // render "—" instead: unknown, and visibly not zero.
  const showSkeleton = isLoading;

  return (
    <dl
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {STATS.map(({ key, label, icon: Icon, accent }) => (
        <Card
          key={key}
          className="group gap-0 py-5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:ring-brand/30 hover:shadow-lg hover:shadow-brand/5"
        >
          <CardContent className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 ease-out group-hover:scale-105",
                accent,
              )}
            >
              <Icon className="size-5" />
            </span>

            <div className="min-w-0">
              <dt className="truncate text-sm text-muted-foreground">{label}</dt>
              <dd className="mt-0.5">
                {showSkeleton ? (
                  // Matches the rendered figure's height so the row does not jump.
                  <Skeleton className="h-8 w-14" />
                ) : stats === null ? (
                  <span className={cn(FIGURE_CLASSES, "text-muted-foreground")}>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Unavailable</span>
                  </span>
                ) : (
                  <span className={cn(FIGURE_CLASSES, "text-foreground")}>
                    {stats[key].toLocaleString()}
                  </span>
                )}
              </dd>
            </div>
          </CardContent>
        </Card>
      ))}
    </dl>
  );
}
