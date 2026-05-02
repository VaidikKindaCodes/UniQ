"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    await new Promise((resolve) => setTimeout(resolve, 700));

    setMessage(
      "Reset delivery is not connected yet in the backend. Keep this screen themed for now and wire a reset endpoint when ready.",
    );
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#110c09] text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(196,166,122,0.12),_transparent_28%),linear-gradient(180deg,_#1a120f_0%,_#140e0b_46%,_#110c09_100%)]" />
        <div className="absolute left-[-8%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-[#c4a67a]/10 blur-3xl" />
        <div className="absolute right-[-6%] bottom-[8%] h-[20rem] w-[20rem] rounded-full bg-[#6c5642]/16 blur-3xl" />
      </div>

      <nav className="relative z-20 border-b border-white/8 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <BrandMark />
          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-semibold text-[#f5efe6] transition-all hover:bg-white/10"
            >
              Back to login
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-center gap-10 px-6 py-12 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#f5efe6]">
              <Sparkles className="h-3.5 w-3.5 text-[#c4a67a]" />
              Recovery request
            </div>
            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              Recover access.
              <span className="block text-[#c4a67a]">Bring your account back into flow.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-[#b1a49a]">
              Use your account email to start a password recovery request. This page now matches the updated auth system and is ready for backend wiring.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <form
            onSubmit={handleSubmit}
            className="dashboard-panel-dark relative overflow-hidden rounded-[2.2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-12"
          >
            <div className="absolute right-0 top-0 h-40 w-40 bg-[#c4a67a]/8 blur-[90px]" />

            <div className="mb-10 text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#c4a67a]">
                Password Recovery
              </span>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                Forgot your password?
              </h1>
              <p className="mt-4 text-sm leading-7 text-[#b1a49a]">
                Enter your account email and we&apos;ll prepare the reset flow.
              </p>
            </div>

            {message && (
              <div className="mb-6 rounded-[1.2rem] border border-[#c4a67a]/20 bg-[#c4a67a]/10 p-4 text-sm text-[#f5efe6]">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <label className="ml-1 text-[9px] font-black uppercase tracking-[0.3em] text-[#b1a49a]">
                Account Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="h-4 w-4 text-[#c4a67a]" />
                </div>
                <input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="w-full rounded-full border border-white/10 bg-[#211915] py-3 pl-11 pr-4 text-sm tracking-[0.16em] uppercase text-[#f5efe6] outline-none transition-all placeholder:text-[#8e8178] focus:border-[#c4a67a]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-[#c4a67a] py-5 transition-all hover:bg-[#d3b488] disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#140e0b]" />
              ) : (
                <>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#140e0b]">
                    Request Reset
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#140e0b] transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-white/8 pt-8">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#8e8178]">
                <ShieldCheck className="h-4 w-4 text-[#c4a67a]" />
                Reset flow ready
              </div>
              <p className="text-right text-[10px] uppercase tracking-[0.28em] text-[#8e8178]">
                Remembered it?{" "}
                <Link href="/login" className="text-[#c4a67a] transition-colors hover:text-white">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
