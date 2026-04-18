"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiService } from "../../services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  User,
  ShieldCheck,
  Mail,
  Lock,
  Building,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type UserRole = "user" | "operator";

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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "user" && !collegeEmail) {
      setError("College email is required for user role");
      return;
    }

    if (role === "operator") {
      if (!department) {
        setError("Department is required for operator role");
        return;
      }
      if (!position) {
        setError("Position is required for operator role");
        return;
      }
    }

    setIsLoading(true);

    try {
      const requestBody: Record<string, string> = {
        name,
        email,
        password,
        role,
      };

      if (role === "user") {
        requestBody.collegeEmail = collegeEmail;
      } else {
        requestBody.department = department;
        requestBody.position = position;
      }

      await apiService.post("/auth/register", requestBody, false);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#180902] text-white">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(243,162,0,0.28),_transparent_30%),linear-gradient(180deg,_#9b4210_0%,_#5d2208_44%,_#180902_100%)]" />
        <div className="absolute left-[-6%] bottom-[8%] h-[26rem] w-[26rem] rounded-full bg-[#ffd88d]/12 blur-3xl" />
        <div className="absolute right-[-6%] top-[10%] h-[20rem] w-[20rem] rounded-full bg-[#7a2f0d]/26 blur-3xl" />
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
              Access portal
            </Link>
            <span className="rounded-full bg-[#ffd88d] px-5 py-2.5 text-sm font-semibold text-[#4b1d08]">
              Create account
            </span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-89px)] max-w-7xl items-start gap-10 px-6 py-12 md:px-12 lg:grid-cols-[1fr_1.1fr]">
        <section className="hidden pt-8 lg:block">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-[#ffe2b5]">
              <Sparkles className="h-3.5 w-3.5 text-[#ffd88d]" />
              Warm, human-first onboarding
            </div>
            <h1 className="text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-white">
              Create your account.
              <span className="block text-[#ffd88d]">Join the calmer side of campus queues.</span>
            </h1>
            <p className="max-w-lg text-base leading-8 text-[#ffe2b5]/74">
              Set up your profile once, then move between service points, alerts, and live queue passes with less friction.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="dashboard-panel-dark rounded-[1.8rem] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd88d]">
                  Student access
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ffe2b5]/74">
                  Register with your college email for faster queue access.
                </p>
              </div>
              <div className="dashboard-panel-dark rounded-[1.8rem] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffd88d]">
                  Operator mode
                </p>
                <p className="mt-3 text-sm leading-6 text-[#ffe2b5]/74">
                  Create service-facing access for staff and live desk operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl">
          <form
            onSubmit={handleSignup}
            className="dashboard-panel-dark relative overflow-hidden rounded-[2.2rem] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-12"
          >
            <div className="absolute right-0 top-0 h-40 w-40 bg-[#ffd88d]/8 blur-[90px]" />

            <div className="mb-10 space-y-3 text-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-[#ffd88d]">
                Account Setup
              </span>
              <h1 className="text-4xl font-bold uppercase tracking-tighter text-white sm:text-5xl">
                Create{" "}
                <span className="font-serif font-light italic lowercase text-[#ffe2b5]/78">
                  account.
                </span>
              </h1>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#ffe2b5]/60">
                Initialize your profile and secure access
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-[1.4rem] border border-red-500/20 bg-red-500/10 p-4 text-[10px] font-bold uppercase tracking-widest text-red-200">
                {error}
              </div>
            )}

            <div className="mb-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`rounded-[1.4rem] border p-4 transition-all ${
                  role === "user"
                    ? "border-[#ffd88d]/30 bg-[#ffd88d] text-[#4b1d08]"
                    : "border-white/10 bg-white/6 text-[#ffe2b5]/68 hover:bg-white/10"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <User size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    User
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole("operator")}
                className={`rounded-[1.4rem] border p-4 transition-all ${
                  role === "operator"
                    ? "border-[#ffd88d]/30 bg-[#ffd88d] text-[#4b1d08]"
                    : "border-white/10 bg-white/6 text-[#ffe2b5]/68 hover:bg-white/10"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Operator
                  </span>
                </div>
              </button>
            </div>

            <div className="space-y-4">
              <AuthInput
                icon={<User className="h-4 w-4 text-[#ffd88d]" />}
                placeholder="FULL IDENTITY"
                value={name}
                onChange={setName}
              />

              <AuthInput
                icon={<Mail className="h-4 w-4 text-[#ffd88d]" />}
                type="email"
                placeholder="CONTACT EMAIL"
                value={email}
                onChange={setEmail}
              />

              {role === "user" ? (
                <AuthInput
                  icon={<Building className="h-4 w-4 text-[#ffd88d]" />}
                  type="email"
                  placeholder="COLLEGE EMAIL"
                  value={collegeEmail}
                  onChange={setCollegeEmail}
                  highlighted
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <AuthInput
                    icon={<Building className="h-4 w-4 text-[#ffd88d]" />}
                    placeholder="DEPARTMENT"
                    value={department}
                    onChange={setDepartment}
                  />
                  <AuthInput
                    icon={<Briefcase className="h-4 w-4 text-[#ffd88d]" />}
                    placeholder="POSITION"
                    value={position}
                    onChange={setPosition}
                  />
                </div>
              )}

              <AuthInput
                icon={<Lock className="h-4 w-4 text-[#ffd88d]" />}
                type="password"
                placeholder="SECURE PASSCODE"
                value={password}
                onChange={setPassword}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-[1.4rem] bg-[#7a2f0d] py-5 transition-all hover:bg-[#5f2209] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#fff4df]">
                  Synchronizing...
                </span>
              ) : (
                <>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#fff4df]">
                    Initialize Account
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#fff4df] transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <p className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-[#ffe2b5]/56">
              Existing user?{" "}
              <Link
                href="/login"
                className="text-[#ffd88d] transition-colors hover:text-white"
              >
                Sign In
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function AuthInput({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  highlighted = false,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  highlighted?: boolean;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-[1.2rem] border py-4 pl-12 pr-4 text-[11px] tracking-[0.18em] uppercase text-[#ffe9c7] outline-none transition-all placeholder:text-[#d7a666] ${
          highlighted
            ? "border-[#ffd88d]/22 bg-[#7a2f0d]/36 focus:border-[#ffd88d]"
            : "border-white/10 bg-white/8 focus:border-[#ffd88d]/50"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
