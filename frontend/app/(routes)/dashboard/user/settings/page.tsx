"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toastBus } from "@/app/utils/toastBus";
import { User, Mail, Bell, ArrowRight, Lock, Globe } from "lucide-react";
import Link from "next/link";

export default function UserSettingsPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [receiveNotifications, setReceiveNotifications] = useState(true);
  const [receiveEmailAlerts, setReceiveEmailAlerts] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.name || "");
    setEmail(user.email || "");
    setCollegeEmail(user.collegeEmail || "");
    setDepartment(user.department || "");
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toastBus.success("Registry updated successfully.");
    } catch {
      toastBus.error("Failed to sync profile data.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSecurity = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toastBus.error("Encryption keys do not match.");
      return;
    }
    setSavingSecurity(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toastBus.success("Security protocols updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toastBus.error("Access update failed.");
    } finally {
      setSavingSecurity(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 animate-in fade-in duration-700">
      <header className="relative flex flex-col justify-between gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
            Account Config
          </span>
          <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
            Profile{" "}
            <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">
              settings.
            </span>
          </h1>
        </div>
        <Link
          href="/dashboard/user/notification"
          className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-6 py-3 transition-all hover:border-[#ffd88d]/40 hover:bg-white/12"
        >
          <Bell className="h-4 w-4 text-[#ffd88d]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">
            Transmission Prefs
          </span>
          <ArrowRight className="h-4 w-4 text-[#ffe2b5]/60 transition-transform group-hover:translate-x-1" />
        </Link>
      </header>

      <div className="grid gap-12 xl:grid-cols-[1fr_380px]">
        <div className="space-y-20">
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd88d]/20 bg-[#ffd88d]/10 text-[#ffd88d]">
                <User size={18} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                Identity Registry
              </h2>
            </div>

            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              <Field label="Full Name">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-medium text-white transition-all focus:border-[#ffd88d]/50 focus:bg-white/[0.04] focus:outline-none"
                />
              </Field>

              <Field label="Master Node (Locked)" muted>
                <div className="w-full rounded-2xl border border-white/8 bg-white/4 px-5 py-4 font-mono text-sm text-[#ffe2b5]/48">
                  {email}
                </div>
              </Field>

              <Field label="College Network Email">
                <input
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/8 px-5 py-4 font-mono text-sm text-white transition-all focus:border-[#ffd88d]/50 focus:outline-none"
                />
              </Field>

              <Field label="Department Sector">
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/8 px-5 py-4 text-sm font-medium text-white transition-all focus:border-[#ffd88d]/50 focus:outline-none"
                />
              </Field>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="rounded-full bg-white px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#4b1d08] transition-all hover:bg-[#ffd88d] disabled:opacity-50"
              >
                {savingProfile ? "Syncing..." : "Commit Changes"}
              </button>
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/8 text-red-300">
                <Lock size={18} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">
                Encryption Protocols
              </h2>
            </div>

            <div className="grid gap-8">
              <div className="group relative">
                <Field label="Current Passphrase">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.4em] text-white transition-all focus:border-red-500/50 focus:outline-none"
                    placeholder="........"
                  />
                </Field>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="New Key">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.4em] text-white transition-all focus:border-[#ffd88d]/50 focus:outline-none"
                  />
                </Field>
                <Field label="Verify Key">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-b border-white/10 bg-transparent py-4 text-sm tracking-[0.4em] text-white transition-all focus:border-[#ffd88d]/50 focus:outline-none"
                  />
                </Field>
              </div>
            </div>

            <button
              onClick={handleSaveSecurity}
              disabled={savingSecurity}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/64 transition-colors hover:text-red-300"
            >
              {savingSecurity ? "Updating..." : "Cycle Security Credentials"}{" "}
              <ArrowRight size={12} />
            </button>
          </section>
        </div>

        <aside className="hidden space-y-12 border-l border-white/8 pl-10 xl:block">
          <section className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffd88d]">
              Network Prefs
            </h3>
            <div className="space-y-6">
              {[
                {
                  label: "Internal Alerts",
                  state: receiveNotifications,
                  set: setReceiveNotifications,
                },
                {
                  label: "External Email Sync",
                  state: receiveEmailAlerts,
                  set: setReceiveEmailAlerts,
                },
              ].map((pref, i) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between"
                  onClick={() => pref.set(!pref.state)}
                >
                  <span className="text-[10px] font-bold uppercase text-[#ffe2b5]/64 transition-colors group-hover:text-white">
                    {pref.label}
                  </span>
                  <div
                    className={`h-6 w-12 rounded-full p-1 transition-all ${
                      pref.state ? "bg-[#ffd88d]" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`h-full w-4 rounded-full bg-[#4b1d08] transition-transform ${
                        pref.state ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffe2b5]/48">
              Comms Channel
            </h3>
            <div className="space-y-4">
              <InfoCard icon={<Mail size={12} className="text-[#ffd88d]" />} title="Direct Support">
                support@campusor.com
              </InfoCard>
              <InfoCard icon={<Globe size={12} className="text-[#ffd88d]" />} title="Status Node">
                Latency: 24ms // All Nodes Operational
              </InfoCard>
            </div>
          </section>
        </aside>
      </div>

      <footer className="flex items-center justify-between border-t border-white/8 pb-8 pt-16 opacity-30">
        <div className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#ffe2b5]/64">
          Uniq Elite Profile Control // Secure Session
        </div>
        <div className="text-[8px] font-mono uppercase tracking-[0.3em] text-[#ffe2b5]/64">
          Rev: 1.0.0
        </div>
      </footer>
    </div>
  );
}

function Field({
  label,
  children,
  muted = false,
}: {
  label: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p
        className={`ml-1 text-[9px] font-black uppercase tracking-widest ${
          muted ? "text-[#ffe2b5]/34" : "text-[#ffe2b5]/54"
        }`}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/8 bg-white/6 p-5 transition-all hover:border-white/12">
      <div className="mb-2 flex items-center gap-3">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest text-white">
          {title}
        </span>
      </div>
      <p className="truncate text-[11px] uppercase tracking-tighter text-[#ffe2b5]/58">
        {children}
      </p>
    </div>
  );
}
