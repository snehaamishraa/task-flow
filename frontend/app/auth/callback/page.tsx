"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleAlert, LoaderCircle } from "lucide-react";

import { LinkButton } from "@/components/common/LinkButton";
import { Logo } from "@/components/common/Logo";
import { TOKEN_STORAGE_KEY } from "@/lib/api-client";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  // Derived during render rather than mirrored into state, which keeps the
  // effect free of synchronous setState and the two from disagreeing.
  const error =
    errorParam ??
    (token === null ? "No sign-in token was returned. Please try again." : null);

  // React runs effects twice under development StrictMode; without this the
  // token would be stored and the redirect fired twice.
  const handledRef = useRef(false);

  useEffect(() => {
    if (error || !token || handledRef.current) return;
    handledRef.current = true;

    try {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      // Reported through the login page's existing error banner instead of
      // local state, so this effect never calls setState.
      router.replace(
        `/login?error=${encodeURIComponent(
          "Could not save your session. Check that browser storage is enabled.",
        )}`,
      );
      return;
    }

    // `replace`, not `push`: the callback URL carries the token as a query
    // param, so it must not remain in history where Back would re-expose it.
    router.replace("/dashboard");
  }, [error, token, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl border border-destructive/25 bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-xl font-semibold text-white">Sign-in failed</h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">{error}</p>
        <LinkButton href="/login" className="mt-6">
          Back to login
        </LinkButton>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center text-center"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        className="size-8 animate-spin text-brand"
        aria-hidden="true"
      />
      <p className="mt-4 text-sm text-zinc-400">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex justify-center">
          <Logo href="/" />
        </div>

        {/* useSearchParams needs a Suspense boundary, or the whole route opts
         * out of prerendering and the build fails. */}
        <Suspense
          fallback={
            <div className="flex justify-center">
              <LoaderCircle
                className="size-8 animate-spin text-brand"
                aria-hidden="true"
              />
            </div>
          }
        >
          <CallbackHandler />
        </Suspense>
      </div>
    </main>
  );
}
