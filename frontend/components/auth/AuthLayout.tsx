import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#09090B] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl p-8">
        {children}
      </div>
    </main>
  );
}