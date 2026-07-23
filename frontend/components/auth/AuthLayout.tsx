import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // py-* so a tall form (the signup fields, or an error banner above them)
    // can scroll instead of being clipped against the viewport edge on short
    // screens. Padding tightens below sm to buy back horizontal room.
    <main className="flex min-h-screen items-center justify-center bg-[#09090B] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {children}
      </div>
    </main>
  );
}