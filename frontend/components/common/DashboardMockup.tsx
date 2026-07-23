import {
  Bell,
  CalendarDays,
  ChartColumnIncreasing,
  Check,
  Kanban,
  LayoutDashboard,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A purely decorative product screenshot built from cards — no external image.
 * The whole tree is `aria-hidden` and contains no focusable elements, so the
 * sample data is never announced to assistive technology.
 */

const RAIL_ITEMS = [
  { id: "overview", icon: LayoutDashboard, active: true },
  { id: "board", icon: Kanban, active: false },
  { id: "calendar", icon: CalendarDays, active: false },
  { id: "reports", icon: ChartColumnIncreasing, active: false },
  { id: "team", icon: Users, active: false },
] as const;

const STATS = [
  { id: "total", label: "Total", value: "12" },
  { id: "progress", label: "In Progress", value: "3" },
  { id: "done", label: "Completed", value: "5" },
] as const;

const TAG_TONES = {
  brand: "border-brand/25 bg-brand/10 text-brand",
  sky: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  rose: "border-rose-400/25 bg-rose-400/10 text-rose-300",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
} as const;

const TASKS = [
  {
    id: "roadmap",
    title: "Finalize Q3 product roadmap",
    tag: "Product",
    tone: "brand",
    initials: "AR",
    done: true,
  },
  {
    id: "onboarding",
    title: "Ship onboarding revamp",
    tag: "Design",
    tone: "sky",
    initials: "MK",
    done: true,
  },
  {
    id: "billing",
    title: "Fix billing webhook retries",
    tag: "Bug",
    tone: "rose",
    initials: "JD",
    done: false,
  },
  {
    id: "launch",
    title: "Draft launch announcement",
    tag: "Growth",
    tone: "amber",
    initials: "SL",
    done: false,
  },
] as const satisfies readonly {
  id: string;
  title: string;
  tag: string;
  tone: keyof typeof TAG_TONES;
  initials: string;
  done: boolean;
}[];

const ACTIVITY = [
  { id: "mon", day: "M", barClass: "h-6" },
  { id: "tue", day: "T", barClass: "h-10" },
  { id: "wed", day: "W", barClass: "h-8" },
  { id: "thu", day: "T", barClass: "h-14" },
  { id: "fri", day: "F", barClass: "h-11" },
  { id: "sat", day: "S", barClass: "h-4" },
  { id: "sun", day: "S", barClass: "h-7" },
] as const;

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("group relative select-none", className)}>
      {/* Ambient glow behind the frame. */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand/12 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />

      <div className="rounded-2xl border border-border/70 bg-card/60 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-background/95">
          {/* Window chrome */}
          <div className="flex items-center gap-3 border-b border-border/60 bg-card/40 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-rose-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border/50 bg-muted/40 px-2.5 py-1.5">
              <Search className="size-3 shrink-0 text-muted-foreground" />
              <span className="truncate font-mono text-[11px] text-muted-foreground">
                taskflow.app/acme/sprint-24
              </span>
            </div>
            <Bell className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-soft text-[10px] font-semibold text-white">
              AR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[3.5rem_minmax(0,1fr)]">
            {/* Icon rail */}
            <div className="hidden flex-col items-center gap-1 border-r border-border/60 bg-card/30 py-4 sm:flex">
              {RAIL_ITEMS.map(({ id, icon: Icon, active }) => (
                <span
                  key={id}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg transition-colors duration-300",
                    active
                      ? "bg-brand/15 text-brand ring-1 ring-brand/25"
                      : "text-muted-foreground/70",
                  )}
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>

            <div className="space-y-4 p-4 sm:p-5">
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Your tasks</p>
                  <p className="text-[11px] text-muted-foreground">
                    12 tasks · 5 completed
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  Up to date
                </span>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {STATS.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-lg border border-border/60 bg-card/50 p-2.5 transition-colors duration-300 group-hover:border-border"
                  >
                    <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                      {stat.label}
                    </p>
                    {/* No delta line: the app stores no history, so there is
                     * no "+8 this week" figure it could ever show. */}
                    <p className="mt-1 font-mono text-lg leading-none font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Task list */}
              <div className="divide-y divide-border/50 overflow-hidden rounded-lg border border-border/60 bg-card/40">
                {TASKS.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-3 py-2.5">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-300",
                        task.done
                          ? "border-brand bg-brand text-white"
                          : "border-border bg-transparent",
                      )}
                    >
                      {task.done ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>

                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-xs",
                        task.done
                          ? "text-muted-foreground line-through"
                          : "text-foreground",
                      )}
                    >
                      {task.title}
                    </span>

                    <span
                      className={cn(
                        "hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium sm:inline-block",
                        TAG_TONES[task.tone],
                      )}
                    >
                      {task.tag}
                    </span>

                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-muted-foreground">
                      {task.initials}
                    </span>
                  </div>
                ))}
              </div>

              {/* Activity chart */}
              <div className="rounded-lg border border-border/60 bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-foreground">
                    Tasks by status
                  </p>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    61 tasks
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-1.5">
                  {ACTIVITY.map((entry) => (
                    <div key={entry.id} className="flex flex-1 flex-col items-center gap-1.5">
                      <span
                        className={cn(
                          "w-full rounded-sm bg-gradient-to-t from-brand/35 to-brand transition-all duration-500 ease-out",
                          entry.barClass,
                        )}
                      />
                      <span className="text-[9px] text-muted-foreground">{entry.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accents */}
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-2.5 rounded-xl border border-border/70 bg-card px-3 py-2.5 shadow-xl shadow-black/40 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 lg:flex">
        <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
          <TrendingUp className="size-4" />
        </span>
        <span className="leading-tight">
          <span className="block text-[11px] font-semibold text-foreground">
            Search + filters
          </span>
          <span className="block text-[10px] text-muted-foreground">vs. last sprint</span>
        </span>
      </div>

      <div className="absolute -top-4 -right-3 hidden items-center gap-2 rounded-full border border-brand/25 bg-card px-3 py-1.5 shadow-lg shadow-brand/10 transition-transform duration-500 ease-out group-hover:translate-y-1 lg:flex">
        <Zap className="size-3.5 text-brand" />
        <span className="text-[11px] font-medium text-foreground">
          Verified sign-in
        </span>
      </div>
    </div>
  );
}
