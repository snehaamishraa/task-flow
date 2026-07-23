import Link from "next/link";
import { redirect } from "next/navigation";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthLayout from "@/components/auth/AuthLayout";
import VerifyOTPForm from "@/components/auth/VerifyOTPForm";

export default async function VerifyOTPPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  // The address comes from the signup/login response. Landing here without one
  // means there is nothing to verify, so send the user back rather than
  // rendering a form that cannot succeed.
  if (!email) {
    redirect("/login");
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Check your email"
        subtitle={`We sent a 6-digit code to ${email}`}
      />

      <VerifyOTPForm email={email} />

      <p className="mt-6 text-center text-sm text-zinc-400">
        Wrong address?{" "}
        <Link
          href="/signup"
          className="text-violet-400 underline-offset-4 hover:underline"
        >
          Sign up again
        </Link>
      </p>
    </AuthLayout>
  );
}
