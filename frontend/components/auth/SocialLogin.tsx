import { Button } from "@/components/ui/button";

export default function SocialLogin() {
  return (
    <div className="mt-6">
      <Button
        variant="outline"
        className="w-full border-zinc-700 bg-transparent hover:bg-zinc-900"
      >
        Continue with Google
      </Button>
    </div>
  );
}