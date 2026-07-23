import AuthHeader from "@/components/auth/AuthHeader";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";
import SocialLogin from "@/components/auth/SocialLogin";

export default function SignupPage() {
  return (
    <AuthLayout>
      <AuthHeader
        title="Create your account"
        subtitle="Start managing your work today."
      />

      <SignupForm />

      <SocialLogin />
    </AuthLayout>
  );
}