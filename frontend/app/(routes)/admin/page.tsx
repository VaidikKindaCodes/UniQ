"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BarChart3, X, ListOrdered, Users, ShieldUser, Settings, ChevronRight } from "lucide-react";
import StatCard from "@/components/charts/StatCard";
import QueueLoadChart from "@/components/charts/QueueLoadChart";
import WaitTimeChart from "@/components/charts/WaitTimeChart";
import TokensServedChart from "@/components/charts/TokensServedChart";
import ServiceEfficiencyChart from "@/components/charts/ServiceEfficiencyChart";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { fetchDashboardSummary, DashboardSummary } from "@/lib/api/admin";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function AdminPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.error("Failed to load dashboard summary:", err);
        setError("Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="flex min-h-screen bg-[#0c0502]">
        <AdminSidebar />

        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/8 pb-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
                  Intelligence Hub
                </span>
                <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
                  System <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">overview.</span>
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#ffd88d]">
                  <BarChart3 size={18} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Network Status</p>
                  <p className="text-[11px] font-bold text-green-500 uppercase tracking-tight">All Nodes Operational</p>
                </div>
              </div>
            </header>

            {loading ? (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-[2rem] bg-white/5 animate-pulse" />
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-80 rounded-[2.5rem] bg-white/5 animate-pulse" />
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/5 p-10 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <X size={32} />
                </div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Telemetry Interrupted</h2>
                <p className="text-sm text-red-400/60 uppercase tracking-widest mb-8">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="rounded-full bg-white px-8 py-3 text-[10px] font-black uppercase tracking-widest text-black hover:bg-[#ffd88d] transition-all"
                >
                  Attempt Reconnection
                </button>
              </div>
            ) : summary ? (
              <div className="space-y-16 animate-in fade-in duration-1000">
                {/* Stats Section */}
                <section>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Active Flux" value={summary.activeTokens.toString()} color="blue" />
                    <StatCard title="Served Today" value={summary.servedToday.toString()} color="green" />
                    <StatCard title="Missed/Skipped" value={summary.skippedTokens.toString()} color="amber" />
                    <StatCard title="Peak Period" value={summary.peakHour} color="purple" />
                  </div>
                </section>

                {/* Command Center & System Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4 space-y-8">
                    <section className="theme-card-elevated rounded-[2.5rem] p-8 border border-white/5 bg-[#1a0f0a]/40">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ffd88d] mb-8">Command Center</h3>
                      <div className="space-y-4">
                        {[
                          { label: "Initialize New Node", icon: <ListOrdered size={16} />, href: "/admin/queues" },
                          { label: "Authorize Operator", icon: <Users size={16} />, href: "/admin/operators" },
                          { label: "Network Invite", icon: <ShieldUser size={16} />, href: "/admin/manage-admins" },
                          { label: "Global Settings", icon: <Settings size={16} />, href: "/admin/settings" },
                        ].map((action, i) => (
                          <Link 
                            key={i} 
                            href={action.href}
                            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-white hover:border-[#ffd88d]/40 hover:bg-white/10 transition-all group"
                          >
                            <span className="text-[#ffd88d] group-hover:scale-110 transition-transform">{action.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{action.label}</span>
                            <ChevronRight size={14} className="ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </section>

                    <section className="theme-card-elevated rounded-[2.5rem] p-8 border border-white/5 bg-[#1a0f0a]/40">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">Service Efficiency</h3>
                      <ServiceEfficiencyChart />
                    </section>
                  </div>

                  <div className="lg:col-span-8 space-y-8">
                     <section className="theme-card-elevated rounded-[2.5rem] p-8 border border-white/5 bg-[#1a0f0a]/40 min-h-[400px]">
                        <div className="flex items-center justify-between mb-10">
                          <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Queue Load Analytics</h3>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-[#ffd88d]" />
                             <span className="text-[8px] font-black uppercase tracking-widest text-[#ffd88d]">Live Metric</span>
                          </div>
                        </div>
                        <QueueLoadChart />
                     </section>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="theme-card-elevated rounded-[2.5rem] p-8 border border-white/5 bg-[#1a0f0a]/40">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">Wait Time distribution</h3>
                           <WaitTimeChart />
                        </section>
                        <section className="theme-card-elevated rounded-[2.5rem] p-8 border border-white/5 bg-[#1a0f0a]/40">
                           <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 mb-8">Traffic served</h3>
                           <TokensServedChart />
                        </section>
                     </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
