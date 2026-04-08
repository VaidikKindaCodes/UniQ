"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toastBus } from "@/app/utils/toastBus";
import {
  User,
  Mail,
  Bell,
  ArrowRight,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function UserSettingsPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeEmail, setCollegeEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
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
    setPosition(user.position || "");
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
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header className="relative pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#00A3C4] font-black">Admin Config</span>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
            Profile <span className="font-serif italic font-light text-slate-500 lowercase">settings.</span>
          </h1>
        </div>
        <Link
          href="/dashboard/user/notification"
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#00A3C4]/50 transition-all rounded-sm"
        >
          <Bell className="h-4 w-4 text-[#00A3C4]" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-white">Transmission Prefs</span>
          <ArrowRight className="h-4 w-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </header>

      <div className="grid gap-12 xl:grid-cols-[1fr_380px]">
        <div className="space-y-20">
          
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center border border-[#00A3C4]/20 bg-[#00A3C4]/5 text-[#00A3C4]">
                <User size={18} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Identity Registry</h2>
            </div>

            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</p>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/2 border border-white/10 px-5 py-4 text-sm font-medium text-white focus:border-[#00A3C4]/50 focus:bg-white/[0.04] focus:outline-none transition-all rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1 opacity-50">Master Node (Locked)</p>
                <div className="w-full border border-white/5 px-5 py-4 text-sm font-mono text-slate-600 bg-transparent">
                  {email}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">College Network Email</p>
                <input
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  className="w-full bg-white/2 border border-white/10 px-5 py-4 text-sm font-mono text-white focus:border-[#00A3C4]/50 focus:outline-none transition-all rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Department Sector</p>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white/2 border border-white/10 px-5 py-4 text-sm font-medium text-white focus:border-[#00A3C4]/50 focus:outline-none transition-all rounded-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="px-10 py-3.5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#00A3C4] transition-all disabled:opacity-50"
              >
                {savingProfile ? "Syncing..." : "Commit Changes"}
              </button>
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 flex items-center justify-center border border-red-500/20 bg-red-500/5 text-red-500">
                <Lock size={18} />
              </div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Encryption Protocols</h2>
            </div>

            <div className="grid gap-8">
              <div className="relative group">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-2">Current Passphrase</p>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-4 text-sm tracking-[0.4em] focus:border-red-500/50 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">New Key</p>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-4 text-sm tracking-[0.4em] focus:border-[#00A3C4]/50 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Verify Key</p>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 py-4 text-sm tracking-[0.4em] focus:border-[#00A3C4]/50 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveSecurity}
              disabled={savingSecurity}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-red-500 flex items-center gap-2 transition-colors"
            >
              {savingSecurity ? "Updating..." : "Cycle Security Credentials"} <ArrowRight size={12} />
            </button>
          </section>
        </div>

      
        <aside className="space-y-12 border-l border-white/5 pl-10 hidden xl:block">
          

          <section className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00A3C4]">Network Prefs</h3>
            <div className="space-y-6">
              {[
                { label: "Internal Alerts", state: receiveNotifications, set: setReceiveNotifications },
                { label: "External Email Sync", state: receiveEmailAlerts, set: setReceiveEmailAlerts },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => pref.set(!pref.state)}>
                  <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-white transition-colors">
                    {pref.label}
                  </span>
                  <div className={`w-12 h-6 p-1 transition-all rounded-sm ${pref.state ? 'bg-[#00A3C4]' : 'bg-white/10'}`}>
                    <div className={`h-full w-4 bg-black transition-transform ${pref.state ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Comms Channel</h3>
            <div className="space-y-4">
              <div className="p-5 border border-white/5 bg-white/1 rounded-sm group hover:border-white/10 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={12} className="text-[#00A3C4]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Direct Support</span>
                </div>
                <p className="text-[11px] font-mono text-slate-500 truncate">support@campusor.com</p>
              </div>
              
              <div className="p-5 border border-white/5 bg-white/1 rounded-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Globe size={12} className="text-[#00A3C4]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white">Status Node</span>
                </div>
                <p className="text-[11px] text-slate-500 uppercase tracking-tighter">Latency: 24ms // All Nodes Operational</p>
              </div>
            </div>
          </section>

        </aside>
      </div>

      <footer className="pt-16 pb-8 border-t border-white/5 opacity-30 flex justify-between items-center">
        <div className="text-[8px] font-mono uppercase tracking-[0.3em]">
          Uniq Elite Profile Control // Secure Session
        </div>
        <div className="text-[8px] font-mono uppercase tracking-[0.3em]">
          Rev: 1.0.0
        </div>
      </footer>
    </div>
  );
}