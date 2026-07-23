/**
 * Thin fetch() wrapper around the Go/Fiber backend.
 *
 * Responsibilities:
 *   - resolve the base URL
 *   - attach the JWT from localStorage as `Authorization: Bearer <token>`
 *   - normalize the backend's two different error shapes into one ApiError
 *   - turn transport failures into readable messages instead of "Failed to fetch"
 *   - clear the session and bounce to /login on 401
 *
 * It sends exactly what the backend already accepts. No endpoint, payload, or
 * header here is speculative — each mirrors code in backend/handlers.
 */

/** localStorage key written by the existing LoginForm. Must stay in sync. */
export const TOKEN_STORAGE_KEY = "token";

/** Backend origin. Override per-environment with NEXT_PUBLIC_API_URL. */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/$/, "");

/** Abort a request that hasn't responded in this many ms. */
const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * A failed request.
 *
 * `status` is 0 when the request never produced an HTTP response (server down,
 * connection dropped, CORS rejection, timeout).
 */
export class ApiError extends Error {
  readonly status: number;
  /** Parsed response body, when the server sent one we could read. */
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  /** True when the request never reached the server or died mid-flight. */
  get isNetworkError(): boolean {
    return this.status === 0;
  }

  /** True when the session is missing, expired, or rejected. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }
}

/** Read the JWT. Returns null during SSR, where localStorage doesn't exist. */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    // Private-mode / blocked storage — treat as signed out rather than crashing.
    return null;
  }
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Nothing useful to do if storage is unavailable.
  }
}

/**
 * Drop the session and send the user to the login page.
 * Uses a hard navigation so all client caches and React state are discarded.
 */
function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  clearStoredToken();
  if (!window.location.pathname.startsWith("/login")) {
    window.location.assign("/login");
  }
}

/**
 * Pull a human-readable message out of a response body.
 *
 * The backend is inconsistent by design of its handlers: create/update/delete
 * and GetTasks return `{ "error": ... }`, while search/filter/stats and the auth
 * middleware return `{ "message": ... }`. Both are checked.
 */
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    for (const key of ["error", "message"] as const) {
      const value = record[key];
      if (typeof value === "string" && value.trim() !== "") {
        return value;
      }
    }
  }
  if (typeof body === "string" && body.trim() !== "") {
    return body;
  }
  return fallback;
}

/** Parse a response body as JSON, tolerating empty and non-JSON payloads. */
async function parseBody(response: Response): Promise<unknown> {
  const raw = await response.text();
  if (raw.trim() === "") return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    // e.g. an HTML error page from a crashed process — keep the text for context.
    return raw;
  }
}

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Serialized as JSON. Omit for GET/DELETE. */
  body?: unknown;
  /** Appended as a query string; undefined values are dropped. */
  params?: QueryParams;
  /** Skip the Authorization header (login/signup). */
  skipAuth?: boolean;
  /** Suppress the automatic redirect on 401. */
  skipAuthRedirect?: boolean;
  /** Caller-controlled cancellation, e.g. superseded search keystrokes. */
  signal?: AbortSignal;
  timeoutMs?: number;
}

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(
    path.startsWith("/") ? path : `/${path}`,
    `${API_BASE_URL}/`,
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Perform a request and return the decoded JSON body.
 *
 * Throws ApiError on any non-2xx response, on transport failure, and on
 * timeout. Callers should let it propagate to a toast rather than swallowing it.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    skipAuth = false,
    skipAuthRedirect = false,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const headers = new Headers({ Accept: "application/json" });

  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getStoredToken();
    if (!token) {
      if (!skipAuthRedirect) redirectToLogin();
      throw new ApiError("You are not signed in.", 401);
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Combine the caller's signal with our timeout so either can abort.
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: combinedSignal,
      cache: "no-store",
    });
  } catch (cause) {
    // Re-throw caller-initiated cancellation untouched so callers can ignore it.
    if (signal?.aborted) {
      throw cause;
    }
    if (timeoutSignal.aborted) {
      throw new ApiError(
        "The server took too long to respond. Please try again.",
        0,
      );
    }
    // Covers server-down, DNS failure, CORS rejection, and a connection that
    // dies mid-request (which is what an unrecovered panic in a Fiber handler
    // looks like from the browser).
    throw new ApiError(
      `Could not reach the server at ${API_BASE_URL}. Check that the API is running.`,
      0,
    );
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) {
      redirectToLogin();
    }
    throw new ApiError(
      extractErrorMessage(
        payload,
        `Request failed with status ${response.status}.`,
      ),
      response.status,
      payload,
    );
  }

  return payload as T;
}

/** Convenience wrappers. Each returns the decoded body. */
export const api = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...options, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "POST", body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ) => apiFetch<T>(path, { ...options, method: "PUT", body }),

  delete: <T>(path: string, options?: Omit<ApiRequestOptions, "method">) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
};

/** Normalize any thrown value into a message safe to show in a toast. */
export function toErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
