import { Logo } from "@/components/common/Logo";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AuthHeader({
  title,
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      {/* Points at the landing page rather than an in-page anchor: from an auth
       * screen there is no "#home" section to scroll to. */}
      <Logo href="/" className="mb-6" />

      <h1 className="text-3xl font-bold text-white">
        {title}
      </h1>

      <p className="mt-2 text-sm text-zinc-400">
        {subtitle}
      </p>
    </div>
  );
}
