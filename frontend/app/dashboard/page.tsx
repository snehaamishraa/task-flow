"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, RefreshCw } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

import { Container } from "@/components/common/Container";
import { Logo } from "@/components/common/Logo";
import { CreateTaskButton } from "@/components/dashboard/CreateTaskButton";
import { CreateTaskDialog } from "@/components/dashboard/CreateTaskDialog";
import { DeleteTaskDialog } from "@/components/dashboard/DeleteTaskDialog";
import { EditTaskDialog } from "@/components/dashboard/EditTaskDialog";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TaskList } from "@/components/dashboard/TaskList";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import { clearStoredToken } from "@/lib/api-client";
import type { Task } from "@/types/task";

export default function DashboardPage() {
  const router = useRouter();

  const {
    tasks,
    stats,
    isInitialLoading,
    isFetching,
    error,
    hasActiveQuery,
    searchQuery,
    setSearchQuery,
    filters,
    setStatusFilter,
    setPriorityFilter,
    clearFilters,
    refresh,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  // Dialog state lives here rather than in the hook: which dialog is open is a
  // view concern, and keeping it out of useTasks leaves that hook reusable.
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleLogout = useCallback(() => {
    // The api client already clears the token and redirects on a 401, so this
    // only covers a deliberate sign-out.
    clearStoredToken();
    router.replace("/login");
  }, [router]);

  const handleEditOpenChange = useCallback((open: boolean) => {
    if (!open) setTaskToEdit(null);
  }, []);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) setTaskToDelete(null);
  }, []);

  // Only the row being deleted dims; an edit is done in a modal, so the card
  // underneath does not need a busy state.
  const busyTaskId = taskToDelete?.id ?? null;

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <Logo href="/" />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={refresh}
                disabled={isFetching}
                aria-label="Refresh tasks"
                // 36px rather than 32px: this sits alone in the header with no
                // adjacent label to widen the tap area.
              >
                <RefreshCw
                  aria-hidden="true"
                  className={isFetching ? "animate-spin" : undefined}
                />
              </Button>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut aria-hidden="true" />
                {/* sr-only rather than `hidden`: `display:none` would drop the
                 * label from the accessibility tree, leaving an icon-only
                 * button with no accessible name on small screens. */}
                <span className="sr-only sm:not-sr-only">Log out</span>
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <main className="flex-1 py-8 sm:py-10">
        <Container className="space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Your tasks
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Everything on your plate, in one place.
              </p>
            </div>

            <CreateTaskButton onClick={() => setIsCreateOpen(true)} />
          </div>

          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              Task statistics
            </h2>
            <StatsCards stats={stats} isLoading={isInitialLoading} />
          </section>

          <section aria-labelledby="tasks-heading" className="space-y-4">
            <h2 id="tasks-heading" className="sr-only">
              Task list
            </h2>

            {/* Search takes the full row on mobile; filters sit beside it from
             * `lg` up, where there is room for both without crowding. */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="lg:max-w-sm lg:flex-1"
              />
              <FilterBar
                filters={filters}
                onStatusChange={setStatusFilter}
                onPriorityChange={setPriorityFilter}
                onClear={clearFilters}
                className="lg:ml-auto"
              />
            </div>

            <TaskList
              tasks={tasks}
              isInitialLoading={isInitialLoading}
              isFetching={isFetching}
              error={error}
              hasActiveQuery={hasActiveQuery}
              onRetry={refresh}
              onEdit={setTaskToEdit}
              onDelete={setTaskToDelete}
              onCreateTask={() => setIsCreateOpen(true)}
              onClearFilters={clearFilters}
              busyTaskId={busyTaskId}
            />
          </section>
        </Container>
      </main>

      <CreateTaskDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onCreate={createTask}
      />

      <EditTaskDialog
        task={taskToEdit}
        onOpenChange={handleEditOpenChange}
        onUpdate={updateTask}
      />

      <DeleteTaskDialog
        task={taskToDelete}
        onOpenChange={handleDeleteOpenChange}
        onDelete={deleteTask}
      />

      {/* Mounted here rather than in the root layout so the landing page keeps
       * zero toast JS, and so app/layout.tsx stays untouched.
       * theme is pinned because there is no ThemeProvider — next-themes would
       * otherwise report "system" and render light toasts on a dark UI. */}
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </div>
  );
}
