"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounce";
import { toErrorMessage } from "@/lib/api-client";
import {
  buildUpdatePayload,
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getDashboardStats,
  queryTasks,
  updateTask as updateTaskRequest,
} from "@/services/task-service";
import type {
  CreateTaskPayload,
  DashboardStats,
  Task,
  TaskFilters,
  TaskPriority,
  TaskStatus,
  UpdateTaskPayload,
} from "@/types/task";

/**
 * Outcome of a create/update/delete call.
 *
 * Mutations resolve instead of throwing so callers can branch without a
 * try/catch at every call site, and so toast text is always a string the
 * server actually sent.
 */
export type MutationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface UseTasksResult {
  /* data */
  tasks: Task[];
  stats: DashboardStats | null;

  /* status */
  /** True only for the very first load — drives the full-page skeleton. */
  isInitialLoading: boolean;
  /** True whenever a list request is in flight, including search and filter. */
  isFetching: boolean;
  /** Message from the last failed list load, or null. */
  error: string | null;
  /** True when the current query and filters returned nothing. */
  isEmpty: boolean;
  /** True when a search term or filter is narrowing the list. */
  hasActiveQuery: boolean;

  /* search + filter controls */
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filters: TaskFilters;
  setStatusFilter: (value: TaskStatus | "") => void;
  setPriorityFilter: (value: TaskPriority | "") => void;
  clearFilters: () => void;

  /* actions */
  refresh: () => void;
  createTask: (payload: CreateTaskPayload) => Promise<MutationResult<Task>>;
  updateTask: (
    task: Task,
    changes: Partial<UpdateTaskPayload>,
  ) => Promise<MutationResult<Task>>;
  deleteTask: (task: Task) => Promise<MutationResult<null>>;
}

const EMPTY_FILTERS: TaskFilters = { status: "", priority: "" };

/**
 * Owns the dashboard's task list, stats, and search/filter state.
 *
 * Deliberately free of UI concerns: it renders nothing and raises no toasts.
 * Callers decide how to present each MutationResult, which keeps this hook
 * testable and avoids coupling data logic to a toast library.
 */
export function useTasks(): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);

  /** Bumped to force a reload of unchanged inputs (retry, post-mutation). */
  const [reloadCount, setReloadCount] = useState(0);

  const debouncedQuery = useDebouncedValue(searchQuery);

  // Destructured to primitives so an equal-but-new filters object cannot
  // retrigger the fetch.
  const { status: statusFilter, priority: priorityFilter } = filters;

  /**
   * Identity of the request the UI currently wants.
   *
   * Loading state is derived by comparing this with the key that was last
   * loaded, which means it needs no setState in the effect body — the flag can
   * never drift out of sync with the inputs that produced it.
   */
  const requestKey = useMemo(
    () =>
      JSON.stringify([
        debouncedQuery.trim(),
        statusFilter,
        priorityFilter,
        reloadCount,
      ]),
    [debouncedQuery, statusFilter, priorityFilter, reloadCount],
  );

  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    // No setState before the first await: the loading flag is derived, so the
    // effect body stays free of synchronous state updates.
    void (async () => {
      const [taskResult, statsResult] = await Promise.allSettled([
        queryTasks(
          debouncedQuery,
          { status: statusFilter, priority: priorityFilter },
          { signal: controller.signal },
        ),
        getDashboardStats({ signal: controller.signal }),
      ]);

      // A newer request superseded this one, or the component unmounted.
      if (controller.signal.aborted) return;

      if (taskResult.status === "fulfilled") {
        setTasks(taskResult.value);
        setError(null);
      } else {
        setError(toErrorMessage(taskResult.reason));
      }

      // Stats failing must not blank a list that loaded fine, so the previous
      // figures are kept rather than cleared.
      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      }

      setLoadedKey(requestKey);
    })();

    // Aborting on cleanup is what cancels superseded search keystrokes and
    // prevents a slow response from overwriting a newer one.
    return () => controller.abort();
  }, [requestKey, debouncedQuery, statusFilter, priorityFilter]);

  /** Re-run the current query. Safe to call from an event handler. */
  const refresh = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  const createTask = useCallback(
    async (payload: CreateTaskPayload): Promise<MutationResult<Task>> => {
      try {
        const created = await createTaskRequest(payload);
        refresh();
        return { ok: true, data: created };
      } catch (cause) {
        return { ok: false, error: toErrorMessage(cause) };
      }
    },
    [refresh],
  );

  const updateTask = useCallback(
    async (
      task: Task,
      changes: Partial<UpdateTaskPayload>,
    ): Promise<MutationResult<Task>> => {
      try {
        // Always a full body: the backend's PUT overwrites every column, so a
        // partial payload would blank whatever it omitted.
        const updated = await updateTaskRequest(
          task.id,
          buildUpdatePayload(task, changes),
        );
        refresh();
        return { ok: true, data: updated };
      } catch (cause) {
        return { ok: false, error: toErrorMessage(cause) };
      }
    },
    [refresh],
  );

  const deleteTask = useCallback(
    async (task: Task): Promise<MutationResult<null>> => {
      try {
        // Not optimistic on purpose. Removing the row first would need a
        // rollback on failure, and a destructive action is the wrong place to
        // show an outcome that might not have happened, so the row stays until
        // the server confirms.
        await deleteTaskRequest(task.id);
        refresh();
        return { ok: true, data: null };
      } catch (cause) {
        return { ok: false, error: toErrorMessage(cause) };
      }
    },
    [refresh],
  );

  const setStatusFilter = useCallback((value: TaskStatus | "") => {
    setFilters((current) => ({ ...current, status: value }));
  }, []);

  const setPriorityFilter = useCallback((value: TaskPriority | "") => {
    setFilters((current) => ({ ...current, priority: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilters(EMPTY_FILTERS);
  }, []);

  // All derived during render, so none of these can contradict the state they
  // are computed from.
  const isFetching = loadedKey !== requestKey;
  const isInitialLoading = loadedKey === null;
  const hasActiveQuery =
    debouncedQuery.trim() !== "" || statusFilter !== "" || priorityFilter !== "";
  const isEmpty =
    !isInitialLoading && !isFetching && error === null && tasks.length === 0;

  return useMemo(
    () => ({
      tasks,
      stats,
      isInitialLoading,
      isFetching,
      error,
      isEmpty,
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
    }),
    [
      tasks,
      stats,
      isInitialLoading,
      isFetching,
      error,
      isEmpty,
      hasActiveQuery,
      searchQuery,
      filters,
      setStatusFilter,
      setPriorityFilter,
      clearFilters,
      refresh,
      createTask,
      updateTask,
      deleteTask,
    ],
  );
}
