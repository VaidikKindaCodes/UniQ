"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "@/app/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await apiService.post("/auth/login", { email, password }, false);
      login(data.token, data.user);

      const next = searchParams.get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;

      const fallbackRoute =
        data.user?.role === "admin"
          ? "/admin"
          : data.user?.role === "operator"
            ? "/dashboard/operator"
            : "/dashboard/user";

      router.replace(safeNext || fallbackRoute);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#180902] text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,162,0,0.28),_transparent_30%),linear-gradient(180deg,_#6f2408_0%,_#2f1104_52%,_#180902_100%)]" />
        <div className="absolute left-[-10%] top-[12%] h-[24rem] w-[24rem] rounded-full bg-[#ffd88d]/14 blur-3xl" />
        <div className="absolute right-[-6%] bottom-[8%] h-[22rem] w-[22rem] rounded-full bg-[#9b4210]/24 blur-3xl" />
      </div>

      <nav className="relative z-20 border-b border-white/8 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <BrandMark />
          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />
            <Link
              href="/signup"
              className="hidden rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-semibold text-[#ffe2b5] transition-all hover:bg-white/10 md:inline-flex"
            >
              Create an account
            </Link>
            <span className="rounded-full bg-[#ffd88d] px-5 py-2.5 text-sm font-semibold text-[#4b1d08]">
              Login
            </span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-center gap-10 px-6 py-12 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#ffe2b5]">
              <Sparkles className="h-3.5 w-3.5 text-[#ffd88d]" />
              Secure campus access
            </div>
            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              Welcome back.
              <span className="block text-[#ffd88d]">Step into the calmer queue flow.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-[#ffe2b5]/74">
              Sign in to track active tokens, browse live service points, and keep campus visits organized without the old rush.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="dashboard-panel-dark rounded-[1.8rem] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd88d]">
                  Live updates
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ffe2b5]/74">
                  Real-time queue status and smarter arrival timing.
                </p>
              </div>
              <div className="dashboard-panel-dark rounded-[1.8rem] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd88d]">
                  Faster check-in
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ffe2b5]/74">
                  One place for identity, alerts, and active queue passes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <div className="dashboard-panel-dark relative overflow-hidden rounded-[2.2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-12">
            <div className="absolute right-0 top-0 h-40 w-40 bg-[#ffd88d]/8 blur-[90px]" />

            <div className="mb-10 text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#ffd88d]">
                Secure Access
              </span>
              <h2 className="mt-4 text-4xl font-bold uppercase tracking-tighter text-white sm:text-5xl">
                Welcome{" "}
                <span className="font-serif font-light italic lowercase text-[#ffe2b5]/78">
                  back.
                </span>
              </h2>
            </div>

            {error && (
              <div className="mb-8 rounded-[1.4rem] border border-red-500/20 bg-red-500/10 p-4 text-[11px] font-bold uppercase tracking-widest text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-7">
              <Field
                label="Identity"
                icon={<Mail className="h-4 w-4 text-[#ffd88d]" />}
                input={
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="w-full rounded-full border border-white/10 bg-[#3c1605]/90 py-3 pl-11 pr-4 text-sm tracking-[0.16em] uppercase text-[#ffe9c7] outline-none transition-all placeholder:text-[#d7a666] focus:border-[#ffd88d]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                }
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="ml-1 text-[9px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/62">
                    Security
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[8px] uppercase tracking-widest text-[#ffd88d]/78 transition-colors hover:text-white"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-4 w-4 text-[#ffd88d]" />
                  </div>
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    className="w-full rounded-full border border-white/10 bg-[#3c1605]/90 py-3 pl-11 pr-4 text-sm tracking-[0.16em] uppercase text-[#ffe9c7] outline-none transition-all placeholder:text-[#d7a666] focus:border-[#ffd88d]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative mt-3 flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.4rem] bg-[#7a2f0d] py-5 transition-all hover:bg-[#5f2209] disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#fff4df]" />
                ) : (
                  <>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#fff4df]">
                      Sign In
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#fff4df] transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/8 pt-8">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#ffe2b5]/58">
                <ShieldCheck className="h-4 w-4 text-[#ffd88d]" />
                Protected session
              </div>
              <p className="text-right text-[10px] uppercase tracking-[0.28em] text-[#ffe2b5]/58">
                New to Uniq?{" "}
                <Link href="/signup" className="text-[#ffd88d] transition-colors hover:text-white">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  icon,
  input,
}: {
  label: string;
  icon: React.ReactNode;
  input: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="ml-1 text-[9px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/62">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        {input}
      </div>
    </div>
  );
}
