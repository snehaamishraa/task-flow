"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SEARCH_INPUT_ID = "task-search";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Controlled search input.
 *
 * Presentational only — debouncing lives in useTasks, so this fires on every
 * keystroke and the hook decides when a request is actually worth sending.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Search tasks…",
  className,
}: SearchBarProps) {
  const hasValue = value !== "";

  return (
    <div className={cn("relative", className)}>
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        Search tasks
      </label>

      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        id={SEARCH_INPUT_ID}
        // type="search" gives mobile keyboards a Search key. The browser's own
        // clear affordance is suppressed below in favour of our button, so the
        // control looks the same across engines.
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          "h-10 pl-9",
          hasValue && "pr-9",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
      />

      {hasValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  );
}
