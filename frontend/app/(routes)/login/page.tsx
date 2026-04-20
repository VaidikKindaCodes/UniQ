"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "@/app/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--accent-primary)] text-xs font-black text-[var(--accent-foreground)] shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
        U
      </div>
      <div>
        <span className="block text-sm font-semibold uppercase tracking-[0.34em] text-[var(--text-primary)]">
          UNIQ
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
      setError(
        err instanceof Error ? err.message : "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--bg-surface)] text-[var(--text-primary)]">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,166,122,0.12),_transparent_24%),linear-gradient(180deg,_#140e0b_0%,_#120d0a_52%,_#0f0a08_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/6" />
        <div className="absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-[rgba(196,166,122,0.08)] blur-[120px]" />
        <div className="absolute right-[6%] bottom-[10%] h-72 w-72 rounded-full bg-[rgba(108,86,66,0.12)] blur-[140px]" />
      </div>

      <nav className="relative z-20 border-b border-[var(--border-default)] bg-[rgba(20,14,11,0.78)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <BrandMark />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/signup"
              className="hidden rounded-full border border-[var(--border-default)] bg-[rgba(255,255,255,0.03)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] md:inline-flex"
            >
              Create account
            </Link>
            <span className="rounded-full border border-[var(--border-strong)] bg-[rgba(255,255,255,0.04)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-primary)]">
              Sign in
            </span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-6 py-10 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <section className="hidden lg:block">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--accent-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              Secure operator access
            </div>
            <h1 className="max-w-3xl text-6xl font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--text-primary)] xl:text-7xl">
              Sign in to
              <span className="block text-[var(--accent-primary)]">Enterprise Queue Management.</span>
            </h1>
            <p className="mt-8 max-w-xl text-xl leading-10 text-[var(--text-secondary)]">
              Monitor active queues, navigate service points, and keep campus traffic organized through a calmer, lower-noise control layer.
            </p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <StatCard value="Live" label="queue visibility" />
              <StatCard value="2m" label="faster session return" />
              <StatCard value="1" label="secure access portal" />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <div className="theme-card-elevated relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
            <div className="absolute inset-x-0 top-0 h-14 border-b border-[var(--border-default)] bg-[rgba(255,255,255,0.015)]" />
            <div className="absolute left-6 top-5 flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.14)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,255,255,0.06)]" />
            </div>
            <div className="absolute right-6 top-5 text-[10px] uppercase tracking-[0.34em] text-[var(--text-tertiary)]">
              Auth Node
            </div>

            <div className="relative pt-16">
              <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[var(--accent-primary)]">
                Secure Access
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
                Welcome back.
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                Enter your credentials to continue into the queue workspace.
              </p>

              {error && (
                <div className="mt-6 rounded-[1.2rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <Field
                  label="Identity"
                  icon={<Mail className="h-4 w-4 text-[var(--accent-primary)]" />}
                >
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="theme-input-muted w-full rounded-[1.15rem] border px-4 py-4 pl-11 text-sm tracking-[0.18em] uppercase text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>

                <Field
                  label="Security"
                  icon={<Lock className="h-4 w-4 text-[var(--accent-primary)]" />}
                  action={
                    <Link
                      href="/forgot-password"
                      className="text-[10px] uppercase tracking-[0.24em] text-[var(--text-tertiary)] transition hover:text-[var(--accent-primary)]"
                    >
                      Forgot password
                    </Link>
                  }
                >
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    className="theme-input-muted w-full rounded-[1.15rem] border px-4 py-4 pl-11 text-sm tracking-[0.18em] uppercase text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Field>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="theme-primary-button group mt-2 flex w-full items-center justify-center gap-3 rounded-[1.15rem] px-5 py-4 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span className="text-[11px] font-black uppercase tracking-[0.38em]">
                        Sign In
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border-default)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--accent-primary)]" />
                  Protected session
                </div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
                  New to Uniq?{" "}
                  <Link href="/signup" className="text-[var(--accent-primary)] transition hover:text-[var(--text-primary)]">
                    Create account
                  </Link>
                </p>
              </div>
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
  action,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--text-secondary)]">
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="theme-card rounded-[1.35rem] px-5 py-4">
      <p className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
        {value}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[var(--text-tertiary)]">
        {label}
      </p>
    </div>
  );
}
