import AuthHeader from "@/components/auth/AuthHeader";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SocialLogin from "@/components/auth/SocialLogin";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back"
        subtitle="Continue managing your work."
      />

      <LoginForm />

      <SocialLogin />
    </AuthLayout>
  );
}