"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";

const OTP_INPUT_LENGTH = 6;

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

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const initialEmail = searchParams.get("email") || "";
  const initialInfo = searchParams.get("info") || "";
  const initialDeliveryError = searchParams.get("deliveryError") || "";
  const initialDevOtp = searchParams.get("devOtp") || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    initialInfo || (initialEmail ? `We sent a 6-digit code to ${initialEmail}.` : ""),
  );
  const [deliveryError, setDeliveryError] = useState(initialDeliveryError);
  const [devOtp, setDevOtp] = useState(initialDevOtp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    setInfo(initialInfo || (initialEmail ? `We sent a 6-digit code to ${initialEmail}.` : ""));
    setDeliveryError(initialDeliveryError);
    setDevOtp(initialDevOtp);
  }, [initialDeliveryError, initialDevOtp, initialEmail, initialInfo]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const destinationRoute = useMemo(() => {
    return (role?: string) => {
      if (role === "admin") return "/admin";
      if (role === "operator") return "/dashboard/operator";
      return "/dashboard/user";
    };
  }, []);

  const handleOtpChange = (value: string) => {
    const sanitized = value.replace(/\D/g, "").slice(0, OTP_INPUT_LENGTH);
    setOtp(sanitized);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email) {
      setError("Email is required to verify your account.");
      return;
    }

    if (otp.length !== OTP_INPUT_LENGTH) {
      setError(`Enter the ${OTP_INPUT_LENGTH}-digit code from your email.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiService.post("/auth/verify-email", { email, otp }, false);
      login(data.token, data.user);
      router.replace(destinationRoute(data.user?.role));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to verify code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Add your email to resend a new code.");
      return;
    }

    setIsResending(true);
    try {
      const data = await apiService.post("/auth/resend-otp", { email }, false);
      setInfo(data.message || "A fresh code is on its way.");
      setDeliveryError(data.emailDelivery === "failed" ? data.emailError || "Email delivery failed." : "");
      setDevOtp(data.devOtpPreview || "");
      setCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#180902] text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,162,0,0.26),_transparent_30%),linear-gradient(180deg,_#8d390d_0%,_#4b1d08_45%,_#180902_100%)]" />
        <div className="absolute left-[-6%] top-[18%] h-[20rem] w-[20rem] rounded-full bg-[#ffd88d]/12 blur-3xl" />
        <div className="absolute right-[-4%] bottom-[10%] h-[24rem] w-[24rem] rounded-full bg-[#7a2f0d]/24 blur-3xl" />
      </div>

      <nav className="relative z-20 border-b border-white/8 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <BrandMark />
          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden rounded-full border border-white/12 bg-white/6 px-5 py-2.5 text-sm font-semibold text-[#ffe2b5] transition-all hover:bg-white/10 md:inline-flex"
            >
              Back to Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-[#ffd88d] px-5 py-2.5 text-sm font-semibold text-[#4b1d08]"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-center gap-10 px-6 py-12 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#ffe2b5]">
              <Sparkles className="h-3.5 w-3.5 text-[#ffd88d]" />
              Step 2 of 2
            </div>
            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              Verify your email.
              <span className="block text-[#ffd88d]">Finish setup and unlock your queue pass.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-[#ffe2b5]/74">
              Enter the one-time code we sent you. After this, your account is ready for live service points, alerts, and active queue tracking.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="dashboard-panel-dark rounded-[1.8rem] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd88d]">
                  Fast activation
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ffe2b5]/74">
                  Use the 6-digit code from your inbox to continue instantly.
                </p>
              </div>
              <div className="dashboard-panel-dark rounded-[1.8rem] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd88d]">
                  Secure handoff
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ffe2b5]/74">
                  Verification links your account to the right dashboard automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <form
            onSubmit={handleVerify}
            className="dashboard-panel-dark relative overflow-hidden rounded-[2.2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-12"
          >
            <div className="absolute right-0 top-0 h-40 w-40 bg-[#ffd88d]/8 blur-[90px]" />

            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#ffd88d]">
                  Account Verification
                </p>
                <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                  Verify your email
                </h1>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4df] text-sm font-black text-[#4b1d08]">
                OTP
              </div>
            </div>

            <p className="mb-6 text-base leading-8 text-[#ffe2b5]/76">
              Enter the 6-digit code we emailed you to activate your account.
            </p>

            {error && (
              <div className="mb-4 rounded-[1.2rem] border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {info && (
              <div className="mb-4 rounded-[1.2rem] border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                {info}
              </div>
            )}

            {deliveryError && (
              <div className="mb-4 rounded-[1.2rem] border border-amber-400/20 bg-amber-300/10 p-3 text-sm text-amber-100">
                OTP was generated, but email delivery failed: {deliveryError}
              </div>
            )}

            {devOtp && (
              <div className="mb-4 rounded-[1.2rem] border border-[#ffd88d]/30 bg-[#ffd88d]/10 p-3 text-sm text-[#fff1d1]">
                Local development OTP: <span className="font-semibold tracking-[0.3em]">{devOtp}</span>
              </div>
            )}

            <label className="mb-2 block text-sm font-medium text-[#fff4df]">
              Email
            </label>
            <div className="relative mb-4">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffd88d]" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-full border border-[#9b4210] bg-[#3c1605]/90 px-4 py-3 pl-11 text-[#fff4df] transition-colors placeholder:text-[#d7a666] focus:border-[#ffd88d] focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="mb-2 block text-sm font-medium text-[#fff4df]">
              6-digit code
            </label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={OTP_INPUT_LENGTH}
              placeholder="• • • • • •"
              className="mb-5 w-full rounded-[2rem] border border-[#9b4210] bg-[#3c1605]/90 px-4 py-4 text-center text-xl tracking-[0.6em] text-[#ffd88d] transition-colors placeholder:text-[#d7a666] focus:border-[#ffd88d] focus:outline-none"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-[#ffd88d] py-4 font-semibold text-[#4b1d08] transition-all hover:bg-[#f1bf63] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Verify and continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-between text-sm text-[#ffe2b5]/78">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || cooldown > 0}
                className="font-semibold text-[#d56b07] transition-colors hover:text-[#ffd88d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : isResending
                    ? "Sending..."
                    : "Resend code"}
              </button>
              <Link
                href="/signup"
                className="transition-colors hover:text-white"
              >
                Use a different email
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-2 border-t border-white/8 pt-6 text-[10px] uppercase tracking-[0.28em] text-[#ffe2b5]/58">
              <ShieldCheck className="h-4 w-4 text-[#ffd88d]" />
              Protected verification flow
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
