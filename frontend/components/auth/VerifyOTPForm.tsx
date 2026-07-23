"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";

import { OTPInput } from "@/components/auth/OTPInput";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, TOKEN_STORAGE_KEY } from "@/lib/api-client";

const CODE_LENGTH = 6;
/** Matches otpResendCooldown in the auth service. */
const RESEND_COOLDOWN_SECONDS = 60;

interface VerifyResponse {
  message?: string;
  token?: string;
}

export default function VerifyOTPForm({ email }: { email: string }) {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  // Guards the auto-submit that fires when the last digit lands, so a re-render
  // cannot post the same code twice.
  const submittingRef = useRef(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const verify = useCallback(
    async (submitted: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      setIsSubmitting(true);
      setError(null);
      setNotice(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: submitted }),
        });

        const data: VerifyResponse = await response.json();

        if (!response.ok || !data.token) {
          setError(data.message ?? "That code is not correct.");
          // Clear so the next attempt starts from an empty field rather than
          // requiring six backspaces.
          setCode("");
          return;
        }

        window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        router.replace("/dashboard");
      } catch {
        setError(
          `Could not reach the server at ${API_BASE_URL}. Check that the API is running.`,
        );
      } finally {
        setIsSubmitting(false);
        submittingRef.current = false;
      }
    },
    [email, router],
  );

  const resend = async () => {
    setError(null);
    setNotice(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data: VerifyResponse = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Could not send a new code.");
        return;
      }

      setCode("");
      setNotice(data.message ?? "A new code is on its way.");
      setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Could not reach the server. Please try again.");
    }
  };

  return (
    <div className="space-y-5">
      <OTPInput
        value={code}
        onChange={setCode}
        onComplete={verify}
        length={CODE_LENGTH}
        disabled={isSubmitting}
        invalid={error !== null}
      />

      {error ? (
        <p
          role="alert"
          className="flex items-start justify-center gap-2 text-center text-sm text-red-400"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      {notice ? (
        <p role="status" className="text-center text-sm text-emerald-400">
          {notice}
        </p>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={code.length !== CODE_LENGTH || isSubmitting}
        onClick={() => verify(code)}
      >
        {isSubmitting ? "Verifying…" : "Verify email"}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Didn&apos;t get it?{" "}
        {secondsLeft > 0 ? (
          <span className="text-zinc-500">Resend in {secondsLeft}s</span>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="rounded-sm text-violet-400 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            Send a new code
          </button>
        )}
      </p>
    </div>
  );
}
