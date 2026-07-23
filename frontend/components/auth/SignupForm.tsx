"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-zinc-300">
          Full Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">
          Email
        </label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-zinc-300">
          Password
        </label>

        <input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-violet-400 hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
}