/**
 * Typed calls for every task endpoint the backend exposes.
 *
 * Routes, payloads, and responses mirror backend/routes/task_routes.go and
 * backend/handlers/task_handler.go exactly — nothing here is invented.
 * The base URL (NEXT_PUBLIC_API_URL) and Bearer token are applied by
 * lib/api-client.ts, so this module only describes shapes.
 */

import { api } from "@/lib/api-client";
import {
  isTaskPriority,
  isTaskStatus,
  type CreateTaskPayload,
  type DashboardStats,
  type Task,
  type TaskFilters,
  type TaskPriority,
  type TaskStatus,
  type UpdateTaskPayload,
} from "@/types/task";

/** Route paths, kept in one place so a backend rename is a one-line change. */
const ENDPOINTS = {
  tasks: "/api/tasks",
  task: (id: number) => `/api/tasks/${id}`,
  search: "/api/tasks/search",
  filter: "/api/tasks/filter",
  stats: "/api/tasks/stats",
} as const;

/** Per-call options callers may pass through, e.g. to cancel a stale search. */
export interface RequestOptions {
  signal?: AbortSignal;
}

/** Shape of DELETE /api/tasks/:id on success. */
export interface DeleteTaskResponse {
  message: string;
}

/* ------------------------------------------------------------------ *
 * Normalizers
 * ------------------------------------------------------------------ */

/**
 * Guarantee an array.
 *
 * GORM pre-allocates the destination slice (gorm/scan.go), so an empty result
 * currently serializes as `[]`. This guard costs nothing and keeps the UI from
 * crashing on `.map` if that ever becomes `null`.
 */
function toTaskArray(value: unknown): Task[] {
  return Array.isArray(value) ? (value as Task[]) : [];
}

/** Coerce the stats map into four numbers, defaulting anything missing to 0. */
function toDashboardStats(value: unknown): DashboardStats {
  const source = (value ?? {}) as Partial<Record<keyof DashboardStats, unknown>>;
  const num = (input: unknown): number =>
    typeof input === "number" && Number.isFinite(input) ? input : 0;

  return {
    total: num(source.total),
    pending: num(source.pending),
    completed: num(source.completed),
    in_progress: num(source.in_progress),
  };
}

/**
 * Convert a form value into what Go's `*time.Time` will accept.
 *
 * encoding/json parses time.Time as RFC 3339, so the `YYYY-MM-DD` produced by
 * `<input type="date">` is rejected and BodyParser answers 400. An empty value
 * must become `null`, never `""` — that fails parsing too.
 */
export function toApiDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "") return null;

  // Already a full timestamp — trust it.
  if (trimmed.includes("T")) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  // Date-only input. Anchor to midnight UTC explicitly: parsing as local
  // midnight would shift the calendar day back for users ahead of UTC — in
  // IST (+05:30), "2026-08-01" becomes 2026-07-31T18:30Z and reads as Jul 31.
  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/** Inverse of `toApiDate`, for pre-filling `<input type="date">` on edit. */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ *
 * Endpoints
 * ------------------------------------------------------------------ */

/** GET /api/tasks — every task for the signed-in user, newest first. */
export async function getTasks(options: RequestOptions = {}): Promise<Task[]> {
  const data = await api.get<unknown>(ENDPOINTS.tasks, options);
  return toTaskArray(data);
}

/**
 * POST /api/tasks — create a task.
 *
 * The service hardcodes `Status: "Pending"` and ignores any status sent, which
 * is why CreateTaskPayload has no status field.
 */
export async function createTask(
  payload: CreateTaskPayload,
  options: RequestOptions = {},
): Promise<Task> {
  return api.post<Task>(
    ENDPOINTS.tasks,
    { ...payload, due_date: toApiDate(payload.due_date) },
    options,
  );
}

/**
 * PUT /api/tasks/:id — replace a task.
 *
 * The handler assigns all five fields unconditionally, so this is a full
 * replace. Build the body with `buildUpdatePayload` to avoid blanking columns.
 */
export async function updateTask(
  id: number,
  payload: UpdateTaskPayload,
  options: RequestOptions = {},
): Promise<Task> {
  return api.put<Task>(
    ENDPOINTS.task(id),
    { ...payload, due_date: toApiDate(payload.due_date) },
    options,
  );
}

/** DELETE /api/tasks/:id — remove a task. */
export async function deleteTask(
  id: number,
  options: RequestOptions = {},
): Promise<DeleteTaskResponse> {
  return api.delete<DeleteTaskResponse>(ENDPOINTS.task(id), options);
}

/**
 * GET /api/tasks/search?q= — case-insensitive LIKE over title and description.
 * An empty `q` matches every row, same as getTasks.
 */
export async function searchTasks(
  query: string,
  options: RequestOptions = {},
): Promise<Task[]> {
  const data = await api.get<unknown>(ENDPOINTS.search, {
    ...options,
    params: { q: query },
  });
  return toTaskArray(data);
}

/**
 * GET /api/tasks/filter?status=&priority= — exact-match narrowing.
 * Blank values are omitted so the backend skips that WHERE clause.
 */
export async function filterTasks(
  filters: TaskFilters,
  options: RequestOptions = {},
): Promise<Task[]> {
  const data = await api.get<unknown>(ENDPOINTS.filter, {
    ...options,
    params: {
      status: filters.status || undefined,
      priority: filters.priority || undefined,
    },
  });
  return toTaskArray(data);
}

/** GET /api/tasks/stats — counts keyed total / pending / completed / in_progress. */
export async function getDashboardStats(
  options: RequestOptions = {},
): Promise<DashboardStats> {
  const data = await api.get<unknown>(ENDPOINTS.stats, options);
  return toDashboardStats(data);
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */

/**
 * Fetch the list for the current search + filter state.
 *
 * There is no endpoint that accepts `q` together with `status`/`priority`, so
 * when both are active this queries `/search` and narrows the result in the
 * browser. That keeps combined search+filter working without touching the API.
 * Single-condition cases stay fully server-side.
 */
export async function queryTasks(
  query: string,
  filters: TaskFilters,
  options: RequestOptions = {},
): Promise<Task[]> {
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery !== "";
  const hasFilters = filters.status !== "" || filters.priority !== "";

  if (hasQuery) {
    const results = await searchTasks(trimmedQuery, options);
    if (!hasFilters) return results;
    return results.filter(
      (task) =>
        (filters.status === "" || task.status === filters.status) &&
        (filters.priority === "" || task.priority === filters.priority),
    );
  }

  if (hasFilters) {
    return filterTasks(filters, options);
  }

  return getTasks(options);
}

/**
 * Produce a complete PUT body from a task plus the fields being changed.
 *
 * Required because UpdateTask overwrites every column: any key left out of the
 * request is written back as its zero value. Starting from the task's current
 * state means an edit that touches only the title cannot wipe the description.
 */
export function buildUpdatePayload(
  task: Task,
  changes: Partial<UpdateTaskPayload> = {},
): UpdateTaskPayload {
  const currentStatus: TaskStatus = isTaskStatus(task.status)
    ? task.status
    : "Pending";
  const currentPriority: TaskPriority = isTaskPriority(task.priority)
    ? task.priority
    : "Medium";

  return {
    title: changes.title ?? task.title,
    description: changes.description ?? task.description,
    status: changes.status ?? currentStatus,
    priority: changes.priority ?? currentPriority,
    due_date:
      changes.due_date !== undefined
        ? toApiDate(changes.due_date)
        : toApiDate(task.due_date),
  };
}
