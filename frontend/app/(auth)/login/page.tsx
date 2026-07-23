import { CircleAlert } from "lucide-react";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SocialLogin from "@/components/auth/SocialLogin";

export default async function LoginPage({
  searchParams,
}: {
  // Async in Next.js 15+. The Google callback redirects here with ?error=…
  // when consent is cancelled or the exchange fails.
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back"
        subtitle="Continue managing your work."
      />

      {error ? (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-300"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <LoginForm />

      <SocialLogin />
    </AuthLayout>
  );
}
