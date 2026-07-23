"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";

import { cn } from "@/lib/utils";

const DIGIT_PATTERN = /\d/g;

export interface OTPInputProps {
  /** Current code. May be shorter than `length` while being typed. */
  value: string;
  onChange: (value: string) => void;
  /** Fired once the last box is filled, so the form can submit itself. */
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

/**
 * Segmented code entry.
 *
 * Renders one input per digit but keeps a single string as the source of
 * truth, so paste, backspace, and arrow keys all operate on the whole code
 * rather than on whichever box happens to hold focus.
 */
export function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  invalid = false,
  className,
}: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusBox = (index: number) => {
    const clamped = Math.max(0, Math.min(length - 1, index));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  };

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) {
      onComplete?.(next);
    }
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    // Read every digit in the box: typing into a filled box, or an autofilled
    // full code landing in box one, both arrive here.
    const digits = event.target.value.match(DIGIT_PATTERN)?.join("") ?? "";
    if (digits === "") return;

    const chars = value.split("");
    for (let i = 0; i < digits.length && index + i < length; i += 1) {
      chars[index + i] = digits[i];
    }

    const next = chars.join("").slice(0, length);
    commit(next);
    focusBox(index + digits.length);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (value[index]) {
        // Clear this box but stay put, so a correction does not also jump.
        const chars = value.split("");
        chars[index] = "";
        commit(chars.join("").trimEnd());
        return;
      }

      // Already empty — step back and clear the previous one.
      if (index > 0) {
        const chars = value.split("");
        chars[index - 1] = "";
        commit(chars.join("").trimEnd());
        focusBox(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    // Strips spaces and dashes, so a code copied out of an email body works
    // whatever formatting came with it.
    const digits =
      event.clipboardData.getData("text").match(DIGIT_PATTERN)?.join("") ?? "";
    if (digits === "") return;

    const next = digits.slice(0, length);
    commit(next);
    focusBox(next.length);
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          // `text` with a numeric inputMode: `number` would add spinners and
          // allow "e" and "-".
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          value={value[index] ?? ""}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid}
          className={cn(
            "size-12 rounded-xl border bg-zinc-900/60 text-center font-mono text-xl font-semibold text-white transition-colors outline-none sm:size-14 sm:text-2xl",
            "focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid ? "border-red-500/60" : "border-zinc-700",
          )}
        />
      ))}
    </div>
  );
}
