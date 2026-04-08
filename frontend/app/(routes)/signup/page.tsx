"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../../../components/footer/Footer";
import { apiService } from "../../services/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User, ShieldCheck, Mail, Lock, Building, Briefcase, ArrowRight } from "lucide-react";

type UserRole = "user" | "operator";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

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
      } else if (role === "operator") {
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
    <main className="min-h-screen bg-[#050505] text-white flex flex-col">
      
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="group">
            <img
              src="/logo/LOGO.svg"
              alt="CampusOR logo"
              className="h-10 w-auto brightness-200 group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        

        <form
          onSubmit={handleSignup}
          className="relative w-full max-w-lg border border-white/10 bg-white/2 p-8 sm:p-12 backdrop-blur-md"
        >
          <div className="mb-10 space-y-2 text-center">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              Create <span className="text-[#00A3C4]">Account</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Initialize system access & profile registration
            </p>
          </div>

          {error && (
            <div className="mb-6 border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 animate-shake">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`p-4 flex flex-col items-center gap-2 transition-all ${
                role === "user" ? "bg-[#00A3C4] text-black" : "bg-[#080808] text-slate-500 hover:text-white"
              }`}
            >
              <User size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">User</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("operator")}
              className={`p-4 flex flex-col items-center gap-2 transition-all ${
                role === "operator" ? "bg-[#00A3C4] text-black" : "bg-[#080808] text-slate-500 hover:text-white"
              }`}
            >
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Operator</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00A3C4] transition-colors" size={16} />
              <input
                type="text"
                placeholder="FULL IDENTITY"
                className="w-full bg-white/3 border border-white/5 px-12 py-4 text-[11px] font-mono tracking-widest uppercase focus:border-[#00A3C4]/50 outline-none transition-all placeholder:text-slate-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00A3C4] transition-colors" size={16} />
              <input
                type="email"
                placeholder="CONTACT EMAIL"
                className="w-full bg-white/3 border border-white/5 px-12 py-4 text-[11px] font-mono tracking-widest uppercase focus:border-[#00A3C4]/50 outline-none transition-all placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {role === "user" ? (
              <div className="relative group animate-in slide-in-from-left duration-300">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00A3C4]" size={16} />
                <input
                  type="email"
                  placeholder="COLLEGE EMAIL"
                  className="w-full bg-[#00A3C4]/5 border border-[#00A3C4]/20 px-12 py-4 text-[11px] font-mono tracking-widest uppercase focus:border-[#00A3C4]/50 outline-none transition-all"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-right duration-300">
                <div className="relative group">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    placeholder="DEPT"
                    className="w-full bg-white/3 border border-white/5 px-12 py-4 text-[11px] font-mono tracking-widest uppercase focus:border-[#00A3C4]/50 outline-none transition-all"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                </div>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                  <input
                    type="text"
                    placeholder="POSITION"
                    className="w-full bg-white/3 border border-white/5 px-12 py-4 text-[11px] font-mono tracking-widest uppercase focus:border-[#00A3C4]/50 outline-none transition-all"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-[#00A3C4] transition-colors" size={16} />
              <input
                type="password"
                placeholder="SECURE PASSCODE"
                className="w-full bg-white/3 border border-white/5 px-12 py-4 text-[11px] font-mono tracking-widest uppercase focus:border-[#00A3C4]/50 outline-none transition-all"
                autoComplete="on"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-10 bg-[#00A3C4] text-black py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? "Synchronizing..." : (
              <>
                Initialize Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="mt-8 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Existing user?{" "}
            <Link
              href="/login"
              className="text-[#00A3C4] hover:text-white transition-colors underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>

      <Footer />
    </main>
  );
}