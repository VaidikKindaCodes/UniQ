"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Lock, ShieldCheck, User } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 bg-white/10 text-sm font-black text-white">
        U
      </div>
      <div>
        <span className="block text-xl font-semibold uppercase tracking-[0.24em] text-white">
          UNIQ
        </span>
        <span className="block text-[10px] uppercase tracking-[0.38em] text-[#ffe2b5]/78">
          Campus Flow
        </span>
      </div>
    </Link>
  );
}

export default function AcceptInvitePage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid invitation link. Missing token or email.");
    }
  }, [token, email]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token || !email) {
      setError("Missing invitation details");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/admin/accept-invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, name, password }),
      });

      const data = (await response.json()) as {
        message?: string;
        token: string;
        user: unknown;
      };

      if (!response.ok) {
        throw new Error(data.message || "Failed to accept invite");
      }

      login(data.token, data.user);
      router.replace("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to accept invite");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <main className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="dashboard-panel-dark max-w-md w-full rounded-[2rem] p-8 text-center text-white">
          <h1 className="mb-4 text-2xl font-bold text-red-300">Invalid Invitation</h1>
          <p className="mb-6 text-[#ffe2b5]/72">
            The invitation link is missing required information.
          </p>
          <Link href="/login" className="text-[#ffd88d] hover:text-white">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#180902] text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,162,0,0.26),_transparent_30%),linear-gradient(180deg,_#8d390d_0%,_#4b1d08_45%,_#180902_100%)]" />
        <div className="absolute left-[-8%] bottom-[8%] h-[24rem] w-[24rem] rounded-full bg-[#ffd88d]/12 blur-3xl" />
        <div className="absolute right-[-4%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-[#7a2f0d]/26 blur-3xl" />
      </div>

      <nav className="relative z-20 border-b border-white/8 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <BrandMark />
          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-semibold text-[#ffe2b5] transition-all hover:bg-white/10"
            >
              Back to login
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-center gap-10 px-6 py-12 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#ffe2b5]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#ffd88d]" />
              Admin onboarding
            </div>
            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              Accept your invitation.
              <span className="block text-[#ffd88d]">Set up admin access with one final step.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-[#ffe2b5]/74">
              Complete your profile and secure your credentials to enter the admin workspace with the right permissions.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <form
            onSubmit={handleAccept}
            className="dashboard-panel-dark relative overflow-hidden rounded-[2.2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-12"
          >
            <div className="absolute right-0 top-0 h-40 w-40 bg-[#ffd88d]/8 blur-[90px]" />

            <div className="mb-8 text-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#ffd88d]">
                Admin Invitation
              </p>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                Complete setup
              </h1>
              <p className="mt-3 text-sm text-[#ffe2b5]/74">
                Setting up account for <span className="font-semibold text-white">{email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-[1.2rem] border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Field label="Full Name" icon={<User className="h-4 w-4 text-[#ffd88d]" />}>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/8 px-4 py-3 pl-11 text-[#fff4df] placeholder:text-[#d7a666] focus:border-[#ffd88d] focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field label="Password" icon={<Lock className="h-4 w-4 text-[#ffd88d]" />}>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/8 px-4 py-3 pl-11 text-[#fff4df] placeholder:text-[#d7a666] focus:border-[#ffd88d] focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Field>

              <Field label="Confirm Password" icon={<Lock className="h-4 w-4 text-[#ffd88d]" />}>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full rounded-[1.2rem] border border-white/10 bg-white/8 px-4 py-3 pl-11 text-[#fff4df] placeholder:text-[#d7a666] focus:border-[#ffd88d] focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </Field>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-[#ffd88d] py-4 font-semibold text-[#4b1d08] transition-all hover:bg-[#f1bf63] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Setting up account..." : "Complete Setup"}
              {!isLoading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#fff4df]">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
