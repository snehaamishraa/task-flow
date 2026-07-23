/**
 * Types mirroring the Go/Fiber backend contract exactly.
 *
 * Source of truth:
 *   backend/models/task.go          (Task, CreateTaskRequest, UpdateTaskRequest)
 *   backend/repositories/task_repository.go  (GetDashboardStats keys)
 *
 * Do not "tidy" the casing here — several fields are intentionally PascalCase
 * because the Go struct omits json tags on the GORM timestamps, so encoding/json
 * falls back to the Go field names.
 */

/** Exact status strings the backend writes and filters on. */
export const TASK_STATUSES = ["Pending", "In Progress", "Completed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

/** Exact priority strings. The backend column defaults to "Medium". */
export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

/**
 * A task as returned by the API.
 *
 * `CreatedAt` / `UpdatedAt` are PascalCase on the wire: models.Task declares
 * them without a json tag, unlike every other field. Renaming them here would
 * silently produce `undefined` at runtime.
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  /** Widened to `string` because the column is free-form text, not an enum. */
  status: TaskStatus | string;
  priority: TaskPriority | string;
  /** RFC 3339 timestamp, or null when unset (*time.Time in Go). */
  due_date: string | null;
  user_id: number;
  CreatedAt: string;
  UpdatedAt: string;
}

/**
 * Body for POST /api/tasks — mirrors models.CreateTaskRequest.
 *
 * Note there is no `status` field: the service hardcodes "Pending" on create,
 * so the UI must not offer a status choice in the create modal.
 */
export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  /** Must be RFC 3339 or null — an empty string fails Go's time parsing. */
  due_date: string | null;
}

/**
 * Body for PUT /api/tasks/:id — mirrors models.UpdateTaskRequest.
 *
 * Every key is required because the service assigns all five fields
 * unconditionally: omitting one overwrites it with the zero value rather than
 * leaving it untouched. Callers must always send the task's full current state.
 */
export interface UpdateTaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
}

/** Response of GET /api/tasks/stats — map[string]int64 with these four keys. */
export interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
  in_progress: number;
}

/** Query params for GET /api/tasks/filter. Empty string means "any". */
export interface TaskFilters {
  status: TaskStatus | "";
  priority: TaskPriority | "";
}

/** Narrowing helpers so unexpected server values fall back to a safe branch. */
export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value);
}
