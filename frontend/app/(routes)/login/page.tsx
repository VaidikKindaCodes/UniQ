"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../../components/footer/Footer";
import { apiService } from "@/app/services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";

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
      const message = err instanceof Error ? err.message : "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#01141a] text-white font-sans overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80')] bg-cover opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-[#01141a]/40 via-[#01141a] to-[#01141a]" />
      </div>
      <nav
        className="relative z-50 flex items-center justify-between px-8 md:px-16 border-b border-white/5 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#00A3C4] flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500">
            <span className="font-serif text-white -rotate-45 group-hover:-rotate-90 transition-transform duration-500">Q</span>
          </div>
          <span className="text-xl font-serif italic tracking-widest uppercase">Uniq</span>
        </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <ThemeToggle />
            <Link
              href="/signup"
              className="theme-text-muted hidden text-sm font-medium transition-colors hover:text-[#005e7a] md:inline"
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-[#005e7a] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-900/10 transition-all hover:bg-[#004b61]"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 grow flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="bg-white/2 border border-white/10 backdrop-blur-3xl p-10 md:p-14 rounded-sm shadow-2xl">
            <div className="mb-12 text-center">
              <span className="text-[9px] uppercase tracking-[0.5em] text-[#00A3C4] font-bold">Secure Access</span>
              <h1 className="text-4xl font-bold tracking-tighter uppercase mt-4">
                Welcome <span className="font-serif italic font-light text-slate-500 lowercase">back.</span>
              </h1>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] uppercase tracking-widest font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-8">
              <div className="group mb-8 space-y-2">
                <label className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black ml-1">Identity</label>
                <div className="relative border-b border-white/10 group-focus-within:border-[#00A3C4] transition-colors p-2">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-[#00A3C4]" />
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="w-full bg-transparent pl-8 pr-4 text-sm tracking-widest uppercase outline-none placeholder:text-slate-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black">Security</label>
                  <Link href="#" className="text-[8px] uppercase tracking-widest text-[#00A3C4] hover:text-white transition-colors">Forgot?</Link>
                </div>
                <div className="relative border-b border-white/10 group-focus-within:border-[#00A3C4] transition-colors pb-2">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-[#00A3C4]" />
                  <input
                    type="password"
                    placeholder="PASSWORD"
                    className="w-full bg-transparent pl-8 pr-4 text-sm tracking-widest outline-none placeholder:text-slate-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full py-6 mt-4 overflow-hidden bg-white rounded-sm transition-all hover:bg-[#00A3C4]"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-black" />
                  ) : (
                    <>
                      <span className="text-black group-hover:text-white text-[10px] font-black uppercase tracking-[0.5em] transition-colors">
                        Sign In
                      </span>
                      <ArrowRight className="h-4 w-4 text-black group-hover:text-white transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
                {/* Hover slide effect */}
                <div className="absolute inset-0 bg-[#00A3C4] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-slate-600 font-bold">
                New to Uniq?{" "}
                <Link href="/signup" className="text-[#00A3C4] hover:text-white transition-colors ml-2 border-b border-[#00A3C4]/20 pb-1">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 py-10 border-t border-white/5 bg-[#010c11] text-center">
        <span className="text-[9px] uppercase tracking-[0.5em] text-slate-700">Uniq Technologies &copy; 2026</span>
      </footer>
    </main>
  );
}
