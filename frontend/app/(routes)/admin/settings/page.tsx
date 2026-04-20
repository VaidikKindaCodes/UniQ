"use client";

import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { Settings, Bell, Globe, Shield, Save, Database, Zap, CheckCircle2, ChevronRight } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="flex min-h-screen bg-[#0c0502]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <header className="mb-14 border-b border-white/8 pb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
                Core Configuration
              </span>
              <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
                Global <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">parameters.</span>
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               <div className="lg:col-span-8 space-y-10">
                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-10">
                     <div className="flex items-center gap-3 mb-10">
                        <Globe className="text-[#ffd88d]" size={20} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Network Preferences</h2>
                     </div>
                     
                     <div className="space-y-8">
                        <div className="flex items-center justify-between group">
                           <div>
                              <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Public Registrations</p>
                              <p className="text-[10px] text-white/30 font-medium uppercase tracking-tight">Allow new users to sign up without invitations</p>
                           </div>
                           <div className="h-6 w-12 rounded-full bg-white/10 relative p-1 border border-white/10 group-hover:border-[#ffd88d]/20 transition-all cursor-pointer">
                              <div className="h-4 w-4 rounded-full bg-white/20 transition-all" />
                           </div>
                        </div>

                        <div className="flex items-center justify-between group">
                           <div>
                              <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Global Maintenance Mode</p>
                              <p className="text-[10px] text-white/30 font-medium uppercase tracking-tight">Disable all queue activity for system maintenance</p>
                           </div>
                           <div className="h-6 w-12 rounded-full bg-white/10 relative p-1 border border-white/10 group-hover:border-[#ffd88d]/20 transition-all cursor-pointer">
                              <div className="h-4 w-4 rounded-full bg-white/20 transition-all" />
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-10">
                     <div className="flex items-center gap-3 mb-10">
                        <Bell className="text-[#ffd88d]" size={20} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Broadcasting Logic</h2>
                     </div>
                     
                     <div className="space-y-8">
                        <div className="group">
                           <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">SMTP INTEGRATION</p>
                           <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-[#ffd88d] border border-white/5 bg-white/5 p-4 rounded-2xl">
                              <CheckCircle2 size={14} />
                              OPERATIONAL: EMAIL.UNIQ.SERVERS
                           </div>
                        </div>
                     </div>
                  </section>
               </div>

               <div className="lg:col-span-4 space-y-10">
                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8">
                     <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">Executive Session</h3>
                     <div className="space-y-4">
                        <button className="w-full flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-5 text-white hover:border-[#ffd88d]/40 hover:bg-white/10 transition-all group">
                           <div className="flex items-center gap-4">
                              <Database size={16} className="text-[#ffd88d]" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Wipe Cache</span>
                           </div>
                           <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                        <button className="w-full flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-5 text-white hover:border-[#ffd88d]/40 hover:bg-white/10 transition-all group">
                           <div className="flex items-center gap-4">
                              <Shield size={16} className="text-[#ffd88d]" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Audit Logs</span>
                           </div>
                           <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </button>
                     </div>
                  </section>
                  
                  <div className="rounded-[2.5rem] bg-[#ffd88d] p-1 text-center group cursor-pointer active:scale-95 transition-all">
                     <div className="rounded-[2.4rem] bg-black py-6 flex items-center justify-center gap-4 group-hover:bg-[#0c0502] transition-colors">
                        <Save size={18} className="text-[#ffd88d]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffd88d]">Commit Changes</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

