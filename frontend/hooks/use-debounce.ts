"use client";

import { useEffect, useState } from "react";

/**
 * Return `value` after it has stopped changing for `delayMs`.
 *
 * Used to keep the search box responsive while limiting how often
 * GET /api/tasks/search fires: the raw value drives the input, the debounced
 * value drives the request.
 *
 * The initial value is returned immediately — the delay applies only to
 * subsequent changes, so first paint is never held back by a pending timer.
 */
export function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // Clearing on each change is what collapses a burst of keystrokes into a
    // single update: only the last timer of the burst survives to fire.
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}
